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

  // Cuisine keyword map for text search
  const cuisineKeyword = {
    'all': 'restaurant',
    'cha-chaan-teng': '茶餐廳',
    'cafe': 'cafe coffee',
    'japanese': 'japanese restaurant',
    'korean': 'korean restaurant',
    'chinese': 'chinese restaurant',
    'western': 'western restaurant',
    'thai': 'thai restaurant',
    'vietnamese': 'vietnamese restaurant pho',
    'fast-food': 'fast food',
    'hotpot': 'hotpot 火鍋',
    'dessert': 'dessert 甲品',
    'noodles': 'noodles 粉麵',
    'bbq': 'bbq barbecue 燒烤',
    'vegetarian': 'vegetarian 素食',
    'street-food': 'street food 小食'
  };

  try {
    const fsqUrl = new URL('https://api.foursquare.com/v3/places/search');
    fsqUrl.searchParams.append('ll', `${lat},${lng}`);
    fsqUrl.searchParams.append('query', cuisineKeyword[category] || 'restaurant');
    fsqUrl.searchParams.append('radius', radius || '800');
    fsqUrl.searchParams.append('limit', '50');
    fsqUrl.searchParams.append('categories', '13000');
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
    console.log('FSQ response status:', response.status, 'results count:', data.results?.length);
    
    let places = data.results || [];

    if (min_rating && min_rating !== '0') {
      places = places.filter(p => (p.rating ? p.rating / 2 >= parseFloat(min_rating) : true));
    }

    if (places.length === 0) {
      console.log('FSQ raw:', JSON.stringify(data).substring(0, 500));
      return res.status(404).json({ error: '附近沒餐廳，試調大搜尋範圍' });
    }

    const randomPlace = places[Math.floor(Math.random() * places.length)];
    const restaurantName = randomPlace.name || 'Unknown';
    const address = randomPlace.location?.formatted_address || randomPlace.location?.address || '地址不明';
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
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
