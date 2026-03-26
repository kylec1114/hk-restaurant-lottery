import { useState, useEffect, useMemo } from 'react';

// 16 款菜式定義
const CUISINES = [
  { id: 'all', name: '隨便', icon: '🍱' },
  { id: 'cha-chaan-teng', name: '茶餐廳', icon: '☕' },
  { id: 'cafe', name: 'Cafe', icon: '🍰' },
  { id: 'japanese', name: '日本菜', icon: '🍣' },
  { id: 'korean', name: '韓國菜', icon: '🍗' },
  { id: 'chinese', name: '中菜', icon: '🥟' },
  { id: 'western', name: '西餐', icon: '🥩' },
  { id: 'thai', name: '泰國菜', icon: '🍲' },
  { id: 'vietnamese', name: '越南菜', icon: '🍜' },
  { id: 'fast-food', name: '快餐', icon: '🍔' },
  { id: 'hotpot', name: '火鍋', icon: '🍲' },
  { id: 'dessert', name: '甜品', icon: '🍧' },
  { id: 'noodles', name: '粉麵', icon: '🍜' },
  { id: 'bbq', name: '燒烤', icon: '🔥' },
  { id: 'vegetarian', name: '素食', icon: '🥬' },
  { id: 'street-food', name: '小食', icon: '🍡' },
];

function App() {
  const [activeTab, setActiveTab] = useState('lottery'); // lottery, favorites, settings
  const [lang, setLang] = useState('zh');
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Filters
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [distance, setDistance] = useState(800);
  const [minRating, setMinRating] = useState(0);
  const [price, setPrice] = useState('any');
  const [openNow, setOpenNow] = useState(true);
  const [isCuisineExpanded, setIsCuisineExpanded] = useState(false);

  // 老虎機動畫文字
  const [slotText, setSlotText] = useState('');
  const slotOptions = ['抽緊...', '搵緊好嘢食...', '睇吓附近有咩...', '即將揭曉...', '諗緊食乜...'];

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const t = (key: string) => {
    const dict: any = {
      zh: {
        title: '🎰 搵食盲盒',
        draw: '📍 撳我抽盲盒！',
        cuisine: '菜式類型',
        distance: '距離',
        rating: '最低評分',
        price: '價錢',
        openNow: '營業中',
        favorites: '❤️ 收藏庫',
        settings: '⚙️ 設定',
        lottery: '🎰 抽獎',
        noFavorites: '仲未有收藏喎',
        address: '地址',
        openrice: '睇 OpenRice',
        gmaps: '開 Google Maps',
        any: '隨便',
        loading: '搜尋中...'
      },
      en: {
        title: '🎰 Food Lottery',
        draw: '📍 Lucky Draw!',
        cuisine: 'Cuisine',
        distance: 'Distance',
        rating: 'Min Rating',
        price: 'Price',
        openNow: 'Open Now',
        favorites: '❤️ Favorites',
        settings: '⚙️ Settings',
        lottery: '🎰 Draw',
        noFavorites: 'No favorites yet',
        address: 'Address',
        openrice: 'OpenRice',
        gmaps: 'Google Maps',
        any: 'Any',
        loading: 'Searching...'
      }
    };
    return dict[lang][key] || key;
  };

  const handleLottery = async () => {
    setLoading(true);
    setRestaurant(null);
    
    // 老虎機動畫
    const interval = setInterval(() => {
      setSlotText(slotOptions[Math.floor(Math.random() * slotOptions.length)]);
    }, 150);

    try {
      if (!navigator.geolocation) {
        alert('Browser does not support location');
        return;
      }
      
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const params = new URLSearchParams({
          lat: latitude.toString(),
          lng: longitude.toString(),
          radius: distance.toString(),
          category: selectedCuisine,
          min_rating: minRating.toString(),
          price: price,
          open_now: openNow.toString()
        });

        const response = await fetch(`/api/lucky-restaurant?${params.toString()}`);
        const data = await response.json();
        
        // 延遲揭曉增加刺激感
        setTimeout(() => {
          clearInterval(interval);
          setRestaurant(data);
          setLoading(false);
        }, 1200);
      }, (err) => {
        console.error(err);
        clearInterval(interval);
        setLoading(false);
        alert('攞唔到定位，請檢查權限');
      });
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setLoading(false);
    }
  };

  const toggleFavorite = (res: any) => {
    if (favorites.some(f => f.name === res.name)) {
      setFavorites(favorites.filter(f => f.name !== res.name));
    } else {
      setFavorites([...favorites, res]);
    }
  };

  const displayedCuisines = isCuisineExpanded ? CUISINES : CUISINES.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24 font-sans">
      {/* Header */}
      <header className="p-6 text-center border-b border-slate-800 sticky top-0 bg-slate-900/80 backdrop-blur-md z-10">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          {t('title')}
        </h1>
      </header>

      <main className="max-w-md mx-auto p-4">
        {activeTab === 'lottery' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Filters */}
            <section className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-slate-400 text-sm uppercase tracking-wider">{t('cuisine')}</h2>
                <button 
                  onClick={() => setIsCuisineExpanded(!isCuisineExpanded)}
                  className="text-blue-400 text-xs font-bold"
                >
                  {isCuisineExpanded ? '摺埋' : '全部'}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {displayedCuisines.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCuisine(c.id)}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                      selectedCuisine === c.id 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-100' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-xl mb-1">{c.icon}</span>
                    <span className="text-xs font-medium">{c.name}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 space-y-4 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-400">{t('distance')}: {distance}m</label>
                  <input 
                    type="range" min="200" max="2000" step="100" 
                    value={distance} onChange={(e) => setDistance(parseInt(e.target.value))}
                    className="w-1/2 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-400">{t('openNow')}</label>
                  <button 
                    onClick={() => setOpenNow(!openNow)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${openNow ? 'bg-blue-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${openNow ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </section>

            {/* Lottery Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleLottery}
                disabled={loading}
                className="group relative w-full py-6 rounded-2xl font-black text-xl overflow-hidden transition-all active:scale-95 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient" />
                <span className="relative z-10 text-white">
                  {loading ? slotText : t('draw')}
                </span>
              </button>
            </div>

            {/* Result */}
            {restaurant && (
              <div className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black text-white">{restaurant.name}</h2>
                      <p className="text-slate-400 text-sm mt-1 flex items-center">
                        📍 {restaurant.address}
                      </p>
                    </div>
                    <button 
                      onClick={() => toggleFavorite(restaurant)}
                      className="text-2xl p-2 rounded-full bg-slate-700/50"
                    >
                      {favorites.some(f => f.name === restaurant.name) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded-md">
                      🟢 營業中
                    </span>
                    <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-1 rounded-md">
                      ⭐ {restaurant.rating || '4.2'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={restaurant.openriceUrl}
                      target="_blank"
                      className="flex items-center justify-center gap-2 bg-[#ffb000] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-all"
                    >
                      🥡 {t('openrice')}
                    </a>
                    <a
                      href={restaurant.gmapsUrl}
                      target="_blank"
                      className="flex items-center justify-center gap-2 bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-600 transition-all"
                    >
                      🗺️ {t('gmaps')}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <h2 className="text-xl font-black mb-4">{t('favorites')}</h2>
            {favorites.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <span className="text-4xl mb-4 block">🍱</span>
                <p>{t('noFavorites')}</p>
              </div>
            ) : (
              favorites.map((fav, i) => (
                <div key={i} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{fav.name}</h3>
                    <p className="text-xs text-slate-400">{fav.address}</p>
                  </div>
                  <button onClick={() => toggleFavorite(fav)} className="text-xl">❤️</button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-black mb-4">{t('settings')}</h2>
            <section className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">Language / 語言</span>
                <div className="flex bg-slate-700 p-1 rounded-lg">
                  <button 
                    onClick={() => setLang('zh')}
                    className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${lang === 'zh' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400'}`}
                  >
                    中
                  </button>
                  <button 
                    onClick={() => setLang('en')}
                    className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${lang === 'en' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400'}`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 pb-safe">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <button 
            onClick={() => setActiveTab('lottery')}
            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all ${activeTab === 'lottery' ? 'text-blue-400' : 'text-slate-500'}`}
          >
            <span className="text-xl">🎰</span>
            <span className="text-[10px] font-bold uppercase">{t('lottery')}</span>
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all ${activeTab === 'favorites' ? 'text-blue-400' : 'text-slate-500'}`}
          >
            <span className="text-xl">❤️</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Favorites</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all ${activeTab === 'settings' ? 'text-blue-400' : 'text-slate-500'}`}
          >
            <span className="text-xl">⚙️</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
