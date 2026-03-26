export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { lat, lng, radius, category, open_now } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: '需要座標' });

  const r = parseFloat(radius) || 800;
  const latF = parseFloat(lat);
  const lngF = parseFloat(lng);

  // Build amenity filter based on category
  let amenityFilter;
  if (category === 'cafe') {
    amenityFilter = '["amenity"="cafe"]';
  } else if (category === 'fast-food') {
    amenityFilter = '["amenity"="fast_food"]';
  } else {
    amenityFilter = '["amenity"~"restaurant|cafe|fast_food"]';
  }

  // Build cuisine filter
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
    'street-food': 'street_food'
  };
  const cuisineVal = cuisineMap[category];
  const cuisineFilter = cuisineVal ? '["cuisine"="' + cuisineVal + '"]' : '';

  const around = '(around:' + r + ',' + latF + ',' + lngF + ')';
  const parts = [
    'node' + amenityFilter + cuisineFilter + around + ';',
    'way' + amenityFilter + cuisineFilter + around + ';'
  ];
  const query = '[out:json][timeout:15];(' + parts.join('') + ');out center 100;';

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Overpass error:', response.status, text.substring(0, 200));
      return res.status(500).json({ error: 'Overpass API error: ' + response.status });
    }

    const data = await response.json();
    let places = (data.elements || []).filter(el => el.tags && el.tags.name);

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
      openriceUrl: 'https://www.openrice.com/zh/hongkong/restaurants?what=' + encodeURIComponent(name),
      gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' Hong Kong'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
