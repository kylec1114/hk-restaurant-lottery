export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { lat, lng } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: '需要座標' });
  }

  try {
    const fsqUrl = new URL('https://api.foursquare.com/v3/places/search');
    fsqUrl.searchParams.append('ll', `${lat},${lng}`);
    fsqUrl.searchParams.append('categories', '13000');
    fsqUrl.searchParams.append('limit', '50');

    const response = await fetch(fsqUrl.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: process.env.FSQ_API_KEY,
      },
    });

    const data = await response.json();
    const places = data.results || [];
    
    if (places.length === 0) {
      return res.status(404).json({ error: '附近沒餐廳' });
    }

    const randomPlace = places[Math.floor(Math.random() * places.length)];
    const restaurantName = randomPlace.name || 'Unknown';
    const address = randomPlace.location?.formatted_address || '地址不明';

    res.status(200).json({
      name: restaurantName,
      address: address,
      openriceUrl: `https://www.openrice.com/zh/hongkong/restaurants?what=${encodeURIComponent(restaurantName)}`,
      gmapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName + ' ' + address)}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
