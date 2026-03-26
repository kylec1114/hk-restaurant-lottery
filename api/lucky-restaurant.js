export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { lat, lng, radius, category } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: '需要座標' });

  const r = Math.min(parseFloat(radius) || 800, 3000);
  const latF = parseFloat(lat);
  const lngF = parseFloat(lng);

  // Convert radius to degrees for bbox (approx)
  const deg = r / 111320;
  const bbox = (latF - deg) + ',' + (lngF - deg) + ',' + (latF + deg) + ',' + (lngF + deg);

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

  let q;
  if (cuisineVal) {
    q = '[out:json][timeout:8][bbox:' + bbox + '];node["amenity"="restaurant"]["cuisine"="' + cuisineVal + '"];out 30;';
  } else if (category === 'cafe') {
    q = '[out:json][timeout:8][bbox:' + bbox + '];node["amenity"="cafe"];out 30;';
  } else if (category === 'fast-food') {
    q = '[out:json][timeout:8][bbox:' + bbox + '];node["amenity"="fast_food"];out 30;';
  } else {
    q = '[out:json][timeout:8][bbox:' + bbox + '];node["amenity"="restaurant"];out 30;';
  }

  const endpoints = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass-api.de/api/interpreter',
  ];

  let data = null;
  for (const ep of endpoints) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const r2 = await fetch(ep, {
        method: 'POST',
        body: q,
        headers: { 'Content-Type': 'text/plain' },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!r2.ok) continue;
      const json = await r2.json();
      if (json && json.elements && json.elements.length > 0) {
        data = json;
        break;
      }
    } catch (e) {
      console.error('ep failed:', ep, e.message);
    }
  }

  if (!data || !data.elements) {
    return res.status(503).json({ error: '服務暫時不可用，請稍後再試' });
  }

  const places = data.elements.filter(el => el.tags && el.tags.name);
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
}
