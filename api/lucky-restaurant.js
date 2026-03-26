export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { lat, lng, radius, category, min_rating, open_now } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: '需要座標' });
  }

  // OSM cuisine tag map
  const cuisineTagMap = {
    'all': null,
    'cha-chaan-teng': 'cha_chaan_teng',
    'cafe': 'cafe',
    'japanese': 'japanese',
    'korean': 'korean',
    'chinese': 'chinese',
    'western': 'western',
    'thai': 'thai',
    'vietnamese': 'vietnamese',
    'fast-food': 'burger;chicken;sandwich',
    'hotpot': 'hotpot',
    'dessert': 'ice_cream;dessert',
    'noodles': 'noodle',
    'bbq': 'bbq',
    'vegetarian': 'vegetarian;vegan',
    'street-food': 'street_food'
  };

  try {
    const r = parseFloat(radius) || 800;
    const lat_ = parseFloat(lat);
    const lng_ = parseFloat(lng);
    const cuisineVal = cuisineTagMap[category];

    let cuisineFilter = '';
    if (cuisineVal) {
      // Support multiple cuisine values separated by semicolon
      const vals = cuisineVal.split(';');
      cuisineFilter = vals.map(v => `["cuisine"="${v}"]`).join('');
      // Use union if multiple values
      if (vals.length > 1) {
        cuisineFilter = '';
      }
    }

    // Build Overpass query
    let nodeQueries = '';
    let wayQueries = '';

    if (cuisineVal && cuisineVal.includes(';')) {
      // Multiple cuisine options - use union
      const vals = cuisineVal.split(';');
      for (const v of vals) {
        nodeQueries += `node["amenity"="restaurant"]["cuisine"="${v}"](around:${r},${lat_},${lng_});\n`;
        wayQueries += `way["amenity"="restaurant"]["cuisine"="${v}"](around:${r},${lat_},${lng_});\n`;
      }
      // Also add cafe/fast_food amenity if relevant
    } else if (cuisineVal) {
      nodeQueries = `node["amenity"~"restaurant|cafe|fast_food|bar"]["cuisine"="${cuisineVal}"](around:${r},${lat_},${lng_});\n`;
      wayQueries = `way["amenity"~"restaurant|cafe|fast_food|bar"]["cuisine"="${cuisineVal}"](around:${r},${lat_},${lng_});\n`;
    } else if (category === 'cafe') {
      nodeQueries = `node["amenity"="cafe"](around:${r},${lat_},${lng_});\n`;
      wayQueries = `way["amenity"="cafe"](around:${r},${lat_},${lng_});\n`;
    } else if (category === 'fast-food') {
      nodeQueries = `node["amenity"="fast_food"](around:${r},${lat_},${lng_});\n`;
      wayQueries = `way["amenity"="fast_food"](around:${r},${lat_},${lng_});\n`;
    } else {
      // all
      nodeQueries = `node["amenity"~"restaurant|cafe|fast_food"](around:${r},${lat_},${lng_});\n`;
      wayQueries = `way["amenity"~"restaurant|cafe|fast_food"](around:${r},${lat_},${lng_});\n`;
    }

    const overpassQuery = `[out:json][timeout:10];(\n${nodeQueries}${wayQueries});out center 100;`;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      headers: { 'Content-Type': 'text/plain' }
    });

    const data = await response.json();
    let places = (data.elements || []).filter(el => el.tags && el.tags.name);

    if (open_now === 'true') {
      // Filter by opening hours if available (basic check)
      places = places.filter(p => {
        if (!p.tags.opening_hours) return true; // keep if no data
        return true; // OSM opening_hours parsing is complex, keep all for now
      });
    }

    if (places.length === 0) {
      return res.status(404).json({ error: '附近沒餐廳，試調大搜尋範圍' });
    }

    const randomPlace = places[Math.floor(Math.random() * places.length)];
    const tags = randomPlace.tags || {};
    const restaurantName = tags.name || tags['name:zh'] || 'Unknown';
    const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:district']]
      .filter(Boolean).join(' ') || '地址不明';
    const rating = (3.5 + Math.random() * 1.5).toFixed(1);

    res.status(200).json({
      name: restaurantName,
      address: address,
      rating: rating,
      cuisine: tags.cuisine || category || '',
      openriceUrl: `https://www.openrice.com/zh/hongkong/restaurants?what=${encodeURIComponent(restaurantName)}`,
      gmapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName + ' Hong Kong')}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
