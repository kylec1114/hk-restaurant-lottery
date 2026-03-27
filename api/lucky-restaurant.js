// Foursquare Places API handler
export default async function handler(req, res) {
  const { lat, lng, radius = 1000, category = 'any', open_now = 'false' } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing location parameters' });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const searchRadius = parseInt(radius);

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
      ll: `${userLat},${userLng}`,
      radius: searchRadius.toString(),
      limit: '50', // Get more results to filter from
    });

    if (foursquareCategory) {
      params.append('categories', foursquareCategory);
    }

    if (open_now === 'true') {
      params.append('open_now', 'true');
    }

    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?${params.toString()}`,
      {
        headers: {
          'Authorization': apiKey,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error('Foursquare API error:', response.status, await response.text());
      return res.status(response.status).json({ error: 'Foursquare API request failed' });
    }

    const data = await response.json();
    const places = data.results || [];

    if (places.length === 0) {
      return res.status(200).json({ error: 'No restaurants found nearby' });
    }

    // Pick a random main restaurant
    const mainPlace = places[Math.floor(Math.random() * places.length)];

    // Get 2-3 alternatives
    const alternatives = places
      .filter(p => p.fsq_id !== mainPlace.fsq_id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Format main restaurant
    const formatPlace = (place) => {
      const address = place.location?.formatted_address || 
                     [place.location?.address, place.location?.locality].filter(Boolean).join(', ') ||
                     'Address unavailable';
      
      return {
        name: place.name,
        address: address,
        cuisine: category,
        lat: place.geocodes?.main?.latitude,
        lng: place.geocodes?.main?.longitude,
        rating: place.rating ? (place.rating / 2).toFixed(1) : '4.0', // Convert 10-scale to 5-scale
        district: place.location?.locality || place.location?.region || 'Hong Kong',
        openriceUrl: `https://www.openrice.com/zh/hongkong/restaurants?what=${encodeURIComponent(place.name)}`,
        gmapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + address)}`,
      };
    };

    return res.status(200).json({
      restaurant: formatPlace(mainPlace),
      alternatives: alternatives.map(formatPlace)
    });

  } catch (error) {
    console.error('Error calling Foursquare API:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
