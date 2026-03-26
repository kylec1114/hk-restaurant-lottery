const FALLBACK_RESTAURANTS = [
  {name: '瑜記鮮魚丹', cuisine: 'noodles', address: '中環吉士笠街18號'},
  {name: '蓮香樓', cuisine: 'chinese', address: '中環威陵道26號'},
  {name: '翠華餐廳', cuisine: 'cha-chaan-teng', address: '中環威陵道15-19號'},
  {name: 'Tim Ho Wan', cuisine: 'chinese', address: 'Shop 12A, Olympian City 2, Tai Kok Tsui'},
  {name: '澤豐園', cuisine: 'chinese', address: '台灣街'},
  {name: 'One Dim Sum', cuisine: 'chinese', address: '旺角'},
  {name: '蔭亮', cuisine: 'japanese', address: '灣仔'},
  {name: 'Genki Sushi', cuisine: 'japanese', address: 'Causeway Bay'},
  {name: '金龍', cuisine: 'korean', address: '尖沙咀'},
  {name: 'Maxim Palace', cuisine: 'chinese', address: 'City Hall'},
  {name: 'Mak Man Kee', cuisine: 'noodles', address: 'Jordan'},
  {name: 'Yung Kee', cuisine: 'chinese', address: 'Central'},
  {name: 'Tsui Wah', cuisine: 'cha-chaan-teng', address: 'Multiple locations'},
  {name: 'Tai Cheong Bakery', cuisine: 'dessert', address: 'Central'},
  {name: 'Kam Wah Cafe', cuisine: 'cha-chaan-teng', address: 'Mong Kok'},
  {name: 'Joy Hing', cuisine: 'cha-chaan-teng', address: 'Wan Chai'},
  {name: 'Ho Lee Fook', cuisine: 'chinese', address: 'Central'},
  {name: 'Samsen', cuisine: 'thai', address: 'Wan Chai'},
  {name: 'Madame Fu', cuisine: 'chinese', address: 'Central'},
  {name: 'The Chairman', cuisine: 'chinese', address: 'Sheung Wan'},
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { lat, lng, category } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: '需要座標' });

  // Filter by category if specified
  let filtered = FALLBACK_RESTAURANTS;
  if (category && category !== 'all') {
    filtered = FALLBACK_RESTAURANTS.filter(r => r.cuisine === category);
  }
  if (filtered.length === 0) filtered = FALLBACK_RESTAURANTS;

  const rest = filtered[Math.floor(Math.random() * filtered.length)];
  const rating = (3.5 + Math.random() * 1.5).toFixed(1);

  return res.status(200).json({
    name: rest.name,
    address: rest.address,
    rating,
    cuisine: rest.cuisine,
    phone: '',
    website: '',
    openriceUrl: 'https://www.openrice.com/zh/hongkong/restaurants?what=' + encodeURIComponent(rest.name),
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(rest.name + ' Hong Kong'),
  });
}
