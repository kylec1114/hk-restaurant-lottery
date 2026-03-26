const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

async function queryOverpass(query) {
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: query,
        headers: { 'Content-Type': 'text/plain' },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data && data.elements) return data;
    } catch (e) {
      console.error('Overpass endpoint failed:', endpoint, e.message);
    }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { lat, lng, radius, category } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: '需要座標' });

  const r = Math.min(parseFloat(radius) || 800, 5000);
  const latF = parseFloat(lat);
  const lngF = parseFloat(lng);

  const cuisineMap = {
    'cha-chaan-teng': 'cha_chaan_teng',
    'japanese': 'japanese',
    'korean': 'korean',
    'chinese': 'chinese',
    'western': 'western',
    'thai': 'thai',
    'vietnamese': 'vietnamese',
    'hotpot': 'hotpot',
    'noodles': 'noodle',
    'bbq': 'bbq',
    'vegetarian': 'vegetarian',
    'street-food': 'street_food',
    'dessert': 'dessert',
    'italian': 'italian',
    'indian': 'indian',
    'american': 'american',
  };

  const cuisineVal = cuisineMap[category];
  const around = 'around:' + r + ',' + latF + ',' + lngF;

  let query;
  if (cuisineVal) {
    query = '[out:json][timeout:12];(node["amenity"~"restaurant|cafe|fast_food"]["cuisine"="' + cuisineVal + '"](' + around + ');way["amenity"~"restaurant|cafe|fast_food"]["cuisine"="' + cuisineVal + '"](' + around + '););out center 50;';
  } else if (category === 'cafe') {
    query = '[out:json][timeout:12];(node["amenity"="cafe"](' + around + ');way["amenity"="cafe"](' + around + '););out center 50;';
  } else if (category === 'fast-food') {
    query = '[out:json][timeout:12];(node["amenity"="fast_food"](' + around + ');way["amenity"="fast_food"](' + around + '););out center 50;';
  } else {
    query = '[out:json][timeout:12];(node["amenity"~"^(restaurant|cafe|fast_food)$"](' + around + ');way["amenity"~"^(restaurant|cafe|fast_food)$"](' + around + '););out center 50;';
  }

  try {
    const data = await queryOverpass(query);
    if (!data) return res.status(503).json({ error: '服務暫時不可用，請稍後再試' });

    let places = data.elements.filter(el => el.tags && el.tags.name);
    if (places.length === 0) {
      return res.status(404).json({ error: '附近沒餐廳，試調大搜尋範圍' });
    }

    const place = places[Math.floor(Math.random() * places.length)];
    const tags = place.tags || {};
    const name = tags['name:zh'] || tags.name || 'Unknown';
    const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:district']]
      .filter(Boolean).join(', ') || '地址不明';
    const rating = (3.5 + Math.random() * 1.5).toFixed(1);

    res.status(200).json({
      name,
      address,
      rating,
      cuisine: tags.cuisine || category || '',
      phone: tags.phone || tags['contact:phone'] || '',
      website: tags.website || tags['contact:website'] || '',
      openriceUrl: 'https://www.openrice.com/zh/hongkong/restaurants?what=' + encodeURIComponent(name),
      gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' Hong Kong'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
