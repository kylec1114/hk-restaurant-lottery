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
const RestaurantCard = ({ res, isMain = false, favorites = [], onToggleFavorite, onShare, reviews = [], onAddReview, t }: any) => {
  const [newReview, setNewReview] = useState('');
  if (!res) return null;
  const isFavorite = favorites.some((f: any) => f.name === res.name);

  return (
    <div className={`bg-slate-800/50 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 ${isMain ? 'mb-8 ring-2 ring-blue-500/50' : 'mb-4'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{res.name || '未命名餐廳'}</h2>
          <p className="text-slate-400 text-sm">📍 {res.address || '地址未提供'}</p>
        </div>
        <button 
          onClick={() => onToggleFavorite(res)}
          className="text-2xl p-2 rounded-full bg-slate-700/50 hover:bg-slate-600 transition-colors"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">🟢 {t('openNow')}</span>
        <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold">⭐ {res.rating || '4.2'}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <a 
          href={res.openriceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl text-center text-sm font-bold transition-all"
        >
          🥡 {t('openrice')}
        </a>
        <a 
          href={res.gmapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-xl text-center text-sm font-bold transition-all"
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

          <div className="border-t border-slate-700/50 pt-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span>{t('reviews')}</span>
              <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full text-slate-400 font-normal">
                {reviews.filter((r: any) => r.restaurantName === res.name).length}
              </span>
            </h3>
            
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {reviews.filter((r: any) => r.restaurantName === res.name).length === 0 ? (
                <p className="text-slate-500 text-sm italic py-2 text-center">仲未有評論...</p>
              ) : (
                reviews.filter((r: any) => r.restaurantName === res.name).map((r: any) => (
                  <div key={r.id} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <p className="text-slate-200 text-sm leading-relaxed">{r.content}</p>
                    <p className="text-slate-500 text-[10px] mt-1">{r.date}</p>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input 
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder={t('writeReview')}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                onClick={() => {
                  if (newReview.trim()) {
                    onAddReview(res.name, newReview);
                    setNewReview('');
                  }
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white p-2 px-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
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
  const [openNow, setOpenNow] = useState(true);
  const [isCuisineExpanded, setIsCuisineExpanded] = useState(false);

  // Animation text
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
          open_now: openNow.toString()
        });

        try {
          const response = await fetch(`/api/lucky-restaurant?${params.toString()}`);
          const data = await response.json();
          
          setTimeout(() => {
            clearInterval(interval);
            setResult(data);
            setLoading(false);
          }, 1200);
        } catch (err) {
          console.error(err);
          clearInterval(interval);
          setLoading(false);
          alert('API 請求失敗');
        }
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
      navigator.share({
        title: '搵食盲盒分享',
        text,
        url: window.location.href
      }).catch(console.error);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <main className="flex-1 max-w-md mx-auto w-full px-5 pt-8 pb-32">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent italic flex items-center gap-2">
            {t('title')}
          </h1>
        </div>

        {activeTab === 'lottery' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Filters */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 mb-8 shadow-2xl shadow-blue-900/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-200 font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {t('cuisine')}
                </h3>
                <button 
                  onClick={() => setIsCuisineExpanded(!isCuisineExpanded)}
                  className="text-blue-400 text-xs font-bold hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1 rounded-full"
                >
                  {isCuisineExpanded ? '摺埋' : '全部'}
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-10">
                {displayedCuisines.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCuisine(c.id)}
                    className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 active:scale-90 ${
                      selectedCuisine === c.id 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-2xl mb-1">{c.icon}</span>
                    <span className="text-[10px] font-bold tracking-tight">{c.name}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-8">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-slate-200 text-sm font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {t('distance')}
                    </span>
                    <span className="text-blue-400 font-mono font-bold text-sm bg-blue-500/10 px-2 py-0.5 rounded-md">{distance}m</span>
                  </div>
                  <input 
                    type="range" 
                    min="200" max="2000" step="100"
                    value={distance}
                    onChange={(e) => setDistance(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30">
                  <span className="text-slate-200 text-sm font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {t('openNow')}
                  </span>
                  <button 
                    onClick={() => setOpenNow(!openNow)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${openNow ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${openNow ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Lottery Button */}
            <button 
              onClick={handleLottery}
              disabled={loading}
              className={`w-full group relative overflow-hidden h-20 rounded-[2rem] font-black text-xl transition-all duration-500 active:scale-95 shadow-2xl ${
                loading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-900/40 hover:shadow-blue-500/30 hover:-translate-y-1'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin"></div>
                    <span className="italic">{slotText}</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🎯</span>
                    {t('draw')}
                  </>
                )}
              </div>
              {!loading && <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>}
            </button>

            {/* Result */}
            {result && (
              <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
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
                  />
                )}

                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="pt-4">
                    <h3 className="text-slate-400 font-bold text-sm mb-4 px-2 flex items-center gap-2">
                      <span className="w-8 h-[1px] bg-slate-800"></span>
                      {t('alternatives')}
                      <span className="flex-1 h-[1px] bg-slate-800"></span>
                    </h3>
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
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-white mb-8 px-1">{t('favorites')}</h2>
            {favorites.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-500 text-center italic">
                <span className="text-5xl mb-4 opacity-20">🍱</span>
                <p>{t('noFavorites')}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {favorites.map((fav: any, i: number) => (
                  <div key={i} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-5 flex justify-between items-center group hover:bg-slate-800/60 transition-all">
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">{fav.name}</h3>
                      <p className="text-slate-500 text-xs truncate max-w-[200px]">📍 {fav.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={fav.gmapsUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-700/50 hover:bg-slate-600 rounded-xl transition-colors">🗺️</a>
                      <button 
                        onClick={() => toggleFavorite(fav)} 
                        className="p-2 bg-slate-700/50 hover:bg-slate-600 rounded-xl text-lg transition-colors"
                      >❤️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-white mb-8 px-1">{t('settings')}</h2>
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 space-y-8">
              <div className="space-y-4">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest px-1">Language / 語言</label>
                <div className="bg-slate-800/80 rounded-2xl p-1.5 flex gap-1">
                  <button 
                    onClick={() => setLang('zh')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${lang === 'zh' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    繁體中文
                  </button>
                  <button 
                    onClick={() => setLang('en')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 p-5">
        <div className="max-w-md mx-auto bg-slate-900/80 backdrop-blur-2xl border border-slate-800/50 rounded-[2.5rem] flex justify-around items-center p-2 shadow-2xl shadow-black">
          <button 
            onClick={() => setActiveTab('lottery')}
            className={`flex flex-col items-center gap-1.5 py-3 px-6 rounded-3xl transition-all duration-300 ${activeTab === 'lottery' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="text-2xl">🎰</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">{t('lottery')}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center gap-1.5 py-3 px-6 rounded-3xl transition-all duration-300 ${activeTab === 'favorites' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="text-2xl">❤️</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Favorites</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1.5 py-3 px-6 rounded-3xl transition-all duration-300 ${activeTab === 'settings' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="text-2xl">⚙️</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
