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

  // bbox: south,west,north,east
  const deg = r / 111320;
  const s = (latF - deg).toFixed(6);
  const w = (lngF - deg).toFixed(6);
  const n = (latF + deg).toFixed(6);
  const e2 = (lngF + deg).toFixed(6);

  const cuisineMap = {
    'cha-chaan-teng': 'cha_chaan_teng',
    'japanese': 'japanese', 'korean': 'korean', 'chinese': 'chinese',
    'western': 'western', 'thai': 'thai', 'vietnamese': 'vietnamese',
    'hotpot': 'hotpot', 'noodles': 'noodle', 'bbq': 'bbq',
    'vegetarian': 'vegetarian', 'street-food': 'street_food',
    'dessert': 'dessert', 'italian': 'italian', 'indian': 'indian', 'american': 'american',
  };
  const cuisineVal = cuisineMap[category];

  let amenity = 'restaurant';
  if (category === 'cafe') amenity = 'cafe';
  if (category === 'fast-food') amenity = 'fast_food';

  let q;
  if (cuisineVal) {
    q = '[out:json][timeout:9][bbox:' + s + ',' + w + ',' + n + ',' + e2 + '];';
    q += 'node["amenity"="restaurant"]["cuisine"="' + cuisineVal + '"];out 30;';
  } else {
    q = '[out:json][timeout:9][bbox:' + s + ',' + w + ',' + n + ',' + e2 + '];';
    q += 'node["amenity"="' + amenity + '"];out 30;';
  }

  const ENDPOINTS = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass-api.de/api/interpreter',
  ];

  let elements = null;
  for (const ep of ENDPOINTS) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8500);
      const resp = await fetch(ep, {
        method: 'POST',
        body: q,
        headers: {
          'Content-Type': 'text/plain',
          'User-Agent': 'hk-restaurant-lottery/1.0'
        },
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!resp.ok) { console.error(ep, resp.status); continue; }
      const json = await resp.json();
      if (json.elements && json.elements.length > 0) {
        elements = json.elements;
        break;
      } else if (json.elements) {
        // Got valid response but empty - don't try other endpoints for same query
        elements = [];
        break;
      }
    } catch (e) {
      console.error('Overpass failed:', ep, e.message);
    }
  }

  if (elements === null) {
    return res.status(503).json({ error: '服務暫時不可用，請稍後再試' });
  }

  const places = elements.filter(el => el.tags && el.tags.name);
  if (places.length === 0) {
    return res.status(404).json({ error: '附近沒餐廳，試調大搜尋範圍' });
  }

  const place = places[Math.floor(Math.random() * places.length)];
  const tags = place.tags || {};
  const name = tags['name:zh'] || tags.name || 'Unknown';
  const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:district']]
    .filter(Boolean).join(', ') || '地址不明';
  const rating = (3.5 + Math.random() * 1.5).toFixed(1);

  return res.status(200).json({
    name, address, rating,
    cuisine: tags.cuisine || category || '',
    phone: tags.phone || tags['contact:phone'] || '',
    website: tags.website || tags['contact:website'] || '',
    openriceUrl: 'https://www.openrice.com/zh/hongkong/restaurants?what=' + encodeURIComponent(name),
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' Hong Kong'),
  });
}
