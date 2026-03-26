export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { lat, lng, radius, category, min_rating, price, open_now } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: '需要座標' });
  }

  // Cuisine mapping to Foursquare Category IDs
  const cuisineMap = {
    'all': '13000',
    'cha-chaan-teng': '13001',
    'cafe': '13065',
    'japanese': '13060',
    'korean': '13063',
    'chinese': '13032',
    'western': '13048',
    'thai': '13114',
    'vietnamese': '13116',
    'fast-food': '13040',
    'hotpot': '13045',
    'dessert': '13040,13065',
    'noodles': '13054',
    'bbq': '13028',
    'vegetarian': '13377',
    'street-food': '13067'
  };

  try {
    const fsqUrl = new URL('https://api.foursquare.com/v3/places/search');
    fsqUrl.searchParams.append('ll', `${lat},${lng}`);
    fsqUrl.searchParams.append('categories', cuisineMap[category] || '13000');
    fsqUrl.searchParams.append('radius', radius || '800');
    fsqUrl.searchParams.append('limit', '50');
    if (price && price !== 'any') fsqUrl.searchParams.append('min_price', price);
    if (open_now === 'true') fsqUrl.searchParams.append('open_now', 'true');
    fsqUrl.searchParams.append('sort', 'DISTANCE');

    const response = await fetch(fsqUrl.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: process.env.FSQ_API_KEY,
      },
    });

    const data = await response.json();
    let places = data.results || [];

    if (min_rating && min_rating !== '0') {
      places = places.filter(p => (p.rating ? p.rating / 2 >= parseFloat(min_rating) : true));
    }

    if (places.length === 0) {
      return res.status(404).json({ error: '附近沒餐廳' });
    }

    const randomPlace = places[Math.floor(Math.random() * places.length)];
    const restaurantName = randomPlace.name || 'Unknown';
    const address = randomPlace.location?.formatted_address || '地址不明';
    const rating = randomPlace.rating ? (randomPlace.rating / 2).toFixed(1) : (3.5 + Math.random() * 1.5).toFixed(1);

    res.status(200).json({
      name: restaurantName,
      address: address,
      rating: rating,
      openriceUrl: `https://www.openrice.com/zh/hongkong/restaurants?what=${encodeURIComponent(restaurantName)}`,
      gmapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName + ' ' + address)}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
