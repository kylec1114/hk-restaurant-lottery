// Restaurant database with lat/lng for distance calculation
const RESTAURANTS = [
  {name: '翠華餐廳', cuisine: 'cha-chaan-teng', address: '中環威陵道15-19號', lat: 22.2816, lng: 114.1547, district: 'Central'},
  {name: '瑜記鮮魚丹', cuisine: 'noodles', address: '中環吉士笠街18號', lat: 22.2827, lng: 114.1542, district: 'Central'},
  {name: 'Tim Ho Wan', cuisine: 'chinese', address: 'Tai Kok Tsui', lat: 22.3244, lng: 114.1609, district: 'Tai Kok Tsui'},
  {name: 'Mak Man Kee', cuisine: 'noodles', address: 'Jordan', lat: 22.3056, lng: 114.1720, district: 'Jordan'},
  {name: 'Yung Kee', cuisine: 'chinese', address: 'Central', lat: 22.2806, lng: 114.1542, district: 'Central'},
  {name: 'Tsui Wah', cuisine: 'cha-chaan-teng', address: 'Multiple locations', lat: 22.2784, lng: 114.1828, district: 'Causeway Bay'},
  {name: 'Tai Cheong Bakery', cuisine: 'dessert', address: 'Central', lat: 22.2816, lng: 114.1559, district: 'Central'},
  {name: 'Kam Wah Cafe', cuisine: 'cha-chaan-teng', address: 'Mong Kok', lat: 22.3193, lng: 114.1694, district: 'Mong Kok'},
  {name: 'Joy Hing', cuisine: 'cha-chaan-teng', address: 'Wan Chai', lat: 22.2780, lng: 114.1744, district: 'Wan Chai'},
  {name: 'Ho Lee Fook', cuisine: 'chinese', address: 'Central', lat: 22.2831, lng: 114.1549, district: 'Central'},
  {name: 'Samsen', cuisine: 'thai', address: 'Wan Chai', lat: 22.2773, lng: 114.1722, district: 'Wan Chai'},
  {name: 'Genki Sushi', cuisine: 'japanese', address: 'Causeway Bay', lat: 22.2802, lng: 114.1849, district: 'Causeway Bay'},
  {name: '金龍', cuisine: 'korean', address: '尖沙咀', lat: 22.2987, lng: 114.1722, district: 'Tsim Sha Tsui'},
  {name: 'Maxim Palace', cuisine: 'chinese', address: 'City Hall', lat: 22.2813, lng: 114.1617, district: 'Central'},
  {name: 'The Chairman', cuisine: 'chinese', address: 'Sheung Wan', lat: 22.2863, lng: 114.1506, district: 'Sheung Wan'},
  {name: '蔭亮', cuisine: 'japanese', address: '灣仔', lat: 22.2785, lng: 114.1750, district: 'Wan Chai'},
  {name: 'One Dim Sum', cuisine: 'chinese', address: '旺角', lat: 22.3208, lng: 114.1686, district: 'Mong Kok'},
  {name: '澤豐園', cuisine: 'chinese', address: '台灣街', lat: 22.3205, lng: 114.1675, district: 'Sham Shui Po'},
  {name: '蓮香樓', cuisine: 'chinese', address: '中環威陵道26號', lat: 22.2823, lng: 114.1540, district: 'Central'},
  {name: 'Madame Fu', cuisine: 'chinese', address: 'Central', lat: 22.2826, lng: 114.1551, district: 'Central'},
  {name: '沙田美食', cuisine: 'cha-chaan-teng', address: 'Sha Tin', lat: 22.3817, lng: 114.1916, district: 'Sha Tin'},
  {name: '大埔餐廳', cuisine: 'chinese', address: 'Tai Po', lat: 22.4507, lng: 114.1646, district: 'Tai Po'},
  {name: '屯門美食', cuisine: 'noodles', address: 'Tuen Mun', lat: 22.3911, lng: 113.9757, district: 'Tuen Mun'},
  {name: '荃灣茶餐廳', cuisine: 'cha-chaan-teng', address: 'Tsuen Wan', lat: 22.3693, lng: 114.1218, district: 'Tsuen Wan'},
  {name: '元朗食店', cuisine: 'chinese', address: 'Yuen Long', lat: 22.4446, lng: 114.0292, district: 'Yuen Long'},
  {name: '上水餐廳', cuisine: 'cha-chaan-teng', address: 'Sheung Shui', lat: 22.5019, lng: 114.1277, district: 'Sheung Shui'},
];

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Return in meters
}

export default async function handler(req, res) {
  const { lat, lng, radius = 1000, category = 'any' } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing location parameters' });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const searchRadius = parseInt(radius);

  // Filter restaurants by distance
  let nearby = RESTAURANTS.filter(r => {
    const distance = calculateDistance(userLat, userLng, r.lat, r.lng);
    return distance <= searchRadius;
  });

  // Filter by category if specified
  if (category && category !== 'any' && category !== 'all') {
    nearby = nearby.filter(r => r.cuisine === category);
  }

  if (nearby.length === 0) {
    return res.status(200).json({ error: 'No restaurants found nearby' });
  }

  // Pick a random restaurant
  const main = nearby[Math.floor(Math.random() * nearby.length)];
  
  // Get 2-3 alternatives
  const alternatives = nearby
    .filter(r => r.name !== main.name)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return res.status(200).json({
    ...main,
    openriceUrl: `https://www.openrice.com/zh/hongkong/restaurants?what=${encodeURIComponent(main.name)}`,
    gmapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(main.name + ' ' + main.address)}`,
    alternatives: alternatives.map(alt => ({
      ...alt,
      openriceUrl: `https://www.openrice.com/zh/hongkong/restaurants?what=${encodeURIComponent(alt.name)}`,
      gmapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alt.name + ' ' + alt.address)}`
    }))
  });
}
