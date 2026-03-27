// Foursquare Places API handler
export default async function handler(req, res) {
  const { lat, lng, category = 'all', open_now = 'false', location_query } = req.query;

  // Require either coordinates or a text location query
  if (!location_query && (!lat || !lng)) {
    return res.status(400).json({ error: 'Missing location parameters' });
  }

  // Map our cuisine categories to Foursquare categories
  const categoryMap = {
    'all': '',
    'cha-chaan-teng': '13003', // Hong Kong Restaurant
    'cafe': '13035', // Café
    'japanese': '13263', // Japanese Restaurant
    'korean': '13263', // Asian Restaurant (covers Korean)
    'chinese': '13099', // Chinese Restaurant
    'western': '13028', // American Restaurant (as proxy for Western)
    'thai': '13352', // Thai Restaurant
    'vietnamese': '13377', // Vietnamese Restaurant
    'fast-food': '13145', // Fast Food Restaurant
    'hotpot': '13099', // Chinese Restaurant (includes hotpot)
    'dessert': '13040', // Dessert Shop
    'noodles': '13263', // Asian Restaurant (noodles)
    'bbq': '13031', // BBQ Joint
    'vegetarian': '13377', // Vegetarian/Vegan Restaurant
    'street-food': '17069', // Food Stand
  };

  const foursquareCategory = categoryMap[category] || '';

  try {
    // Foursquare Places API v3 - Search endpoint
    const apiKey = process.env.FOURSQUARE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Foursquare API key not configured' });
    }

    const params = new URLSearchParams({
      limit: '50', // Get more results to filter from
    });

    if (location_query) {
      // Text-based location search using 'near' parameter
      params.append('near', location_query);
      params.append('query', 'restaurant');
    } else {
      // Coordinate-based search
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const searchRadius = 1500; // Fixed 1500m radius
      params.append('ll', `${userLat},${userLng}`);
      params.append('radius', searchRadius.toString());
    }

    if (foursquareCategory) {
      params.append('categories', foursquareCategory);
    }

    if (open_now === 'true') {
      params.append('open_now', 'true');
    }

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': apiKey
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Foursquare API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(200).json({ error: 'No restaurants found' });
    }

    // Pick a random restaurant
    const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 10));
    const place = data.results[randomIndex];

    // Format a place object
    const formatPlace = (p) => ({
      name: p.name,
      address: p.location?.formatted_address || p.location?.address || 'Address unavailable',
      district: p.location?.locality || p.location?.region || 'Area',
      rating: (p.rating ? p.rating.toFixed(1) : null),
      openriceUrl: `https://www.openrice.com/zh/hongkong/restaurants?what=${encodeURIComponent(p.name)}`,
      gmapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + (p.location?.address || ''))}`
    });

    // Get alternatives (next 3 restaurants)
    const alternatives = data.results
      .filter((p, idx) => idx !== randomIndex)
      .slice(0, 3)
      .map(formatPlace);

    const restaurant = {
      name: place.name,
      address: place.location?.formatted_address || place.location?.address || 'Address unavailable',
      district: place.location?.locality || 'HK',
      rating: (place.rating ? place.rating.toFixed(1) : null),
      openriceUrl: `https://www.openrice.com/zh/hongkong/restaurants?what=${encodeURIComponent(place.name)}`,
      gmapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + (place.location?.address || ''))}`
    };

    return res.status(200).json({
      restaurant,
      alternatives
    });

  } catch (err) {
    console.error('API Error:', err);
    if (err.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timeout', details: 'API call took too long' });
    }
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
