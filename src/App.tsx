import { useState, useEffect, useMemo } from 'react';

// --- Utilities & Constants ---

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

const TRANSLATIONS: any = {
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
    reviews: '💬 評論',
    noFavorites: '仲未有收藏喎',
    address: '地址',
    openrice: '睇 OpenRice',
    gmaps: '開 Google Maps',
    any: '隨便',
    loading: '搜尋中...',
    share: '📤 分享卡片',
    alternatives: '🍣 附近仲有...',
    writeReview: '寫低你嘅評論...',
    submitReview: '提交評論'
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
    reviews: '💬 Reviews',
    noFavorites: 'No favorites yet',
    address: 'Address',
    openrice: 'OpenRice',
    gmaps: 'Google Maps',
    any: 'Any',
    loading: 'Searching...',
    share: '📤 Share Card',
    alternatives: '🍣 Others Nearby...',
    writeReview: 'Write your review...',
    submitReview: 'Submit'
  }
};

// --- Components ---

const RestaurantCard = ({ 
  res, 
  isMain = false, 
  favorites = [], 
  onToggleFavorite, 
  onShare, 
  reviews = [], 
  onAddReview,
  t,
  lang
}: any) => {
  const [newReview, setNewReview] = useState('');
  
  if (!res) return null;

  const isFavorite = favorites.some((f: any) => f.name === res.name);

  return (
    <div className={`w-full max-w-sm rounded-3xl p-6 bg-slate-800/80 backdrop-blur-md border ${isMain ? 'border-blue-500 shadow-xl shadow-blue-500/20' : 'border-slate-700'} mt-4 mx-auto`}>
      <div className="flex justify-between items-start mb-4">
        <h2 className={`font-black tracking-tight ${isMain ? 'text-2xl text-white' : 'text-lg text-slate-200'}`}>
          {res.name || '未命名餐廳'}
        </h2>
        <button 
          onClick={() => onToggleFavorite(res)}
          className="text-2xl p-2 rounded-full bg-slate-700/50 hover:bg-slate-600 transition-colors"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <p className="text-slate-400 text-sm mb-4">📍 {res.address || '地址未提供'}</p>
      
      <div className="flex gap-2 mb-6 text-xs font-bold uppercase">
        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">🟢 {t('openNow')}</span>
        <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30">⭐ {res.rating || '4.2'}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <a 
          href={res.openriceUrl || '#'} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-[#ffb300] hover:bg-[#ffa000] text-black py-3 rounded-2xl font-bold transition-all active:scale-95"
        >
          🥡 {t('openrice')}
        </a>
        <a 
          href={res.gmapsUrl || '#'} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-2xl font-bold transition-all active:scale-95"
        >
          🗺️ {t('gmaps')}
        </a>
      </div>

      {isMain && (
        <>
          <button 
            onClick={() => onShare(res)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-bold mb-6 transition-all shadow-lg shadow-blue-600/30"
          >
            {t('share')}
          </button>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-white font-bold mb-3">{t('reviews')}</h3>
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {reviews.filter((r: any) => r.restaurantName === res.name).length === 0 ? (
                <p className="text-slate-500 text-xs italic">仲未有評論...</p>
              ) : (
                reviews.filter((r: any) => r.restaurantName === res.name).map((r: any) => (
                  <div key={r.id} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                    <p className="text-slate-300 text-sm">{r.content}</p>
                    <span className="text-slate-500 text-[10px] mt-1 block">{r.date}</span>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input 
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder={t('writeReview')}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={() => {
                  if (newReview.trim()) {
                    onAddReview(res.name, newReview);
                    setNewReview('');
                  }
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-xl transition-colors"
              >
                🚀
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState('lottery');
  const [lang, setLang] = useState('zh');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [favorites, setFavorites] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [userReviews, setUserReviews] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('userReviews');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Filters
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [distance, setDistance] = useState(800);
  const [minRating, setMinRating] = useState(0);
  const [price, setPrice] = useState('any');
  const [openNow, setOpenNow] = useState(true);
  const [isCuisineExpanded, setIsCuisineExpanded] = useState(false);

  // Animation
  const [slotText, setSlotText] = useState('');
  const slotOptions = ['抽緊...', '搵緊好嘢食...', '睇吓附近有咩...', '即將揭曉...', '諗緊食乜...'];

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('userReviews', JSON.stringify(userReviews));
  }, [userReviews]);

  const t = (key: string) => {
    return TRANSLATIONS[lang]?.[key] || key;
  };

  const handleLottery = async () => {
    setLoading(true);
    setResult(null);
    
    const interval = setInterval(() => {
      setSlotText(slotOptions[Math.floor(Math.random() * slotOptions.length)]);
    }, 150);

    try {
      if (!navigator.geolocation) {
        alert('Browser does not support location');
        setLoading(false);
        clearInterval(interval);
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

        setTimeout(() => {
          clearInterval(interval);
          setResult(data);
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
    if (!res || !res.name) return;
    setFavorites(prev => 
      prev.some(f => f.name === res.name)
        ? prev.filter(f => f.name !== res.name)
        : [...prev, res]
    );
  };

  const shareCard = (res: any) => {
    const text = `我抽到呢間餐廳：${res.name}！📍 地址：${res.address}。一齊去食？`;
    if (navigator.share) {
      navigator.share({ title: '搵食盲盒分享', text, url: window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('已複製分享文字！');
    }
  };

  const addReview = (restaurantName: string, content: string) => {
    const review = {
      id: Date.now(),
      restaurantName,
      content,
      date: new Date().toLocaleDateString()
    };
    setUserReviews(prev => [review, ...prev]);
  };

  const displayedCuisines = isCuisineExpanded ? CUISINES : CUISINES.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans pb-24 overflow-x-hidden">
      <div className="max-w-md mx-auto px-6 py-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            {t('title')}
          </h1>
        </header>

        {activeTab === 'lottery' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Filters */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-6 border border-slate-800 mb-8 shadow-inner">
              <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="font-bold text-slate-300">{t('cuisine')}</h3>
                <button 
                  onClick={() => setIsCuisineExpanded(!isCuisineExpanded)}
                  className="text-blue-400 text-xs font-bold hover:text-blue-300"
                >
                  {isCuisineExpanded ? '摺埋' : '全部'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {displayedCuisines.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCuisine(c.id)}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-all active:scale-95 ${
                      selectedCuisine === c.id 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl mb-1">{c.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{c.name}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-6 px-1">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span>{t('distance')}</span>
                    <span>{distance}m</span>
                  </div>
                  <input 
                    type="range" min="200" max="2000" step="100"
                    value={distance}
                    onChange={(e) => setDistance(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400">{t('openNow')}</span>
                  <button 
                    onClick={() => setOpenNow(!openNow)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${openNow ? 'bg-blue-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${openNow ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Lottery Button */}
            <button 
              onClick={handleLottery}
              disabled={loading}
              className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all active:scale-[0.98] shadow-2xl ${
                loading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-900/20 hover:shadow-blue-500/40'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{slotText}</span>
                </div>
              ) : t('draw')}
            </button>

            {/* Result */}
            {result && (
              <div className="mt-8 animate-in zoom-in-95 duration-500">
                {result.main && (
                  <RestaurantCard 
                    res={result.main} 
                    isMain={true} 
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onShare={shareCard}
                    reviews={userReviews}
                    onAddReview={addReview}
                    t={t}
                    lang={lang}
                  />
                )}
                
                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="mt-12 mb-8">
                    <h3 className="text-xl font-black text-slate-300 px-2 mb-2">{t('alternatives')}</h3>
                    <div className="space-y-4">
                      {result.alternatives.map((alt: any, idx: number) => (
                        <RestaurantCard 
                          key={idx} 
                          res={alt} 
                          favorites={favorites}
                          onToggleFavorite={toggleFavorite}
                          onShare={shareCard}
                          reviews={userReviews}
                          onAddReview={addReview}
                          t={t}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black mb-8">{t('favorites')}</h2>
            {favorites.length === 0 ? (
              <div className="text-center py-20 opacity-20">
                <span className="text-6xl block mb-4">🍱</span>
                <p className="font-bold">{t('noFavorites')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((fav, i) => (
                  <div key={i} className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-800 flex justify-between items-center shadow-lg">
                    <div className="flex-1 mr-4">
                      <h3 className="font-bold text-lg text-white">{fav.name}</h3>
                      <p className="text-slate-500 text-xs truncate max-w-[200px]">{fav.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={fav.gmapsUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-full text-lg">🗺️</a>
                      <button onClick={() => toggleFavorite(fav)} className="p-2 bg-slate-800 rounded-full text-lg">❤️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black mb-8">{t('settings')}</h2>
            <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800">
              <p className="text-slate-400 font-bold mb-4 uppercase text-xs tracking-widest">Language / 語言</p>
              <div className="flex bg-slate-950 p-1 rounded-xl">
                <button 
                  onClick={() => setLang('zh')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'zh' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  繁體中文
                </button>
                <button 
                  onClick={() => setLang('en')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 safe-area-inset-bottom z-50">
        <div className="max-w-md mx-auto px-6 py-3 flex justify-around items-center">
          <button 
            onClick={() => setActiveTab('lottery')}
            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all ${activeTab === 'lottery' ? 'text-blue-400' : 'text-slate-500'}`}
          >
            <span className="text-2xl">🎰</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">{t('lottery')}</span>
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all ${activeTab === 'favorites' ? 'text-blue-400' : 'text-slate-500'}`}
          >
            <span className="text-2xl">❤️</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Favorites</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all ${activeTab === 'settings' ? 'text-blue-400' : 'text-slate-500'}`}
          >
            <span className="text-2xl">⚙️</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
