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
    submitReview: '提交評論',
    noResults: '附近搵唔到餐廳，試吓較大個距離？'
  },
  en: {
    title: '🎰 Food Lottery',
    draw: '📍 Lucky Draw!',
    cuisine: 'Cuisine',
    distance: 'Distance',
    rating: 'Min Rating',
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
    submitReview: 'Submit',
    noResults: 'No restaurants found nearby. Try increasing distance?'
  }
};

// --- Components ---
const RestaurantCard = ({ res, isMain = false, favorites = [], onToggleFavorite, onShare, reviews = [], onAddReview, t }: any) => {
  const [newReview, setNewReview] = useState('');
  if (!res || res.error) return null;
  const isFavorite = favorites.some((f: any) => f.name === res.name);

  return (
    <div className={`bg-slate-800/60 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-700/50 transition-all duration-500 ${isMain ? 'mb-8 ring-2 ring-blue-500/30 shadow-2xl shadow-blue-900/20' : 'mb-4 opacity-90'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1 leading-tight">{res.name}</h2>
          <p className="text-slate-400 text-xs">📍 {res.address}</p>
        </div>
        <button onClick={() => onToggleFavorite(res)} className="text-2xl p-2.5 rounded-2xl bg-slate-700/50 hover:bg-slate-600 transition-all active:scale-90">
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">🟢 {t('openNow')}</span>
        <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">⭐ {res.rating || '4.2'}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <a href={res.openriceUrl} target="_blank" rel="noopener noreferrer" className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl text-center text-xs font-black transition-all shadow-lg shadow-orange-900/20 uppercase tracking-widest">🥡 {t('openrice')}</a>
        <a href={res.gmapsUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-2xl text-center text-xs font-black transition-all uppercase tracking-widest">🗺️ {t('gmaps')}</a>
      </div>

      {isMain && (
        <div className="space-y-6 pt-2">
          <button onClick={() => onShare(res)} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-900/30 uppercase tracking-widest">{t('share')}</button>

          <div className="border-t border-slate-700/50 pt-6">
            <h3 className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              {t('reviews')} <span className="bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full text-[9px]">{reviews.filter((r: any) => r.restaurantName === res.name).length}</span>
            </h3>
            <div className="space-y-3 mb-5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {reviews.filter((r: any) => r.restaurantName === res.name).length === 0 ? (
                <p className="text-slate-600 text-[11px] italic text-center py-4">仲未有評論...</p>
              ) : (
                reviews.filter((r: any) => r.restaurantName === res.name).map((r: any) => (
                  <div key={r.id} className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/50">
                    <p className="text-slate-300 text-xs leading-relaxed">{r.content}</p>
                    <p className="text-slate-500 text-[9px] mt-2 font-mono">{r.date}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input value={newReview} onChange={(e) => setNewReview(e.target.value)} placeholder={t('writeReview')} className="flex-1 bg-slate-900 border border-slate-700/50 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-all" />
              <button onClick={() => { if (newReview.trim()) { onAddReview(res.name, newReview); setNewReview(''); } }} className="bg-blue-500 hover:bg-blue-400 text-white w-12 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-90 flex items-center justify-center">🚀</button>
            </div>
          </div>
        </div>
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
    try { const saved = localStorage.getItem('favorites'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  const [userReviews, setUserReviews] = useState<any[]>(() => {
    try { const saved = localStorage.getItem('userReviews'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [distance, setDistance] = useState(800);
  const [openNow, setOpenNow] = useState(true);
  const [isCuisineExpanded, setIsCuisineExpanded] = useState(false);
  const [slotText, setSlotText] = useState('');
  const slotOptions = ['正在分析您的口味...', '正在查看附近的美味...', '即將揭暁您的盲盒...', '正在挑選特色餐廳...', '尋找最佳食評中...'];

  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('userReviews', JSON.stringify(userReviews)); }, [userReviews]);

  const t = (key: string) => TRANSLATIONS[lang]?.[key] || key;

  const handleLottery = async () => {
    setLoading(true); setResult(null);
    const interval = setInterval(() => { setSlotText(slotOptions[Math.floor(Math.random() * slotOptions.length)]); }, 200);

    try {
      if (!navigator.geolocation) { alert('Browser does not support location'); setLoading(false); clearInterval(interval); return; }
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const params = new URLSearchParams({ lat: latitude.toString(), lng: longitude.toString(), radius: distance.toString(), category: selectedCuisine, open_now: openNow.toString() });
        try {
          const res = await fetch(`/api/lucky-restaurant?${params.toString()}`);
          const data = await res.json();
          setTimeout(() => { clearInterval(interval); setResult(data); setLoading(false); }, 1500);
        } catch (err) { clearInterval(interval); setLoading(false); alert('API 請求失敗'); }
      }, (err) => { clearInterval(interval); setLoading(false); alert('攒唔到定位，請檢查權限'); });
    } catch (err) { clearInterval(interval); setLoading(false); }
  };

  const toggleFavorite = (res: any) => {
    if (!res || !res.name) return;
    setFavorites(prev => prev.some(f => f.name === res.name) ? prev.filter(f => f.name !== res.name) : [...prev, res]);
  };

  const shareCard = (res: any) => {
    const text = `我抽到呢間餐廳：${res.name}！📍 地址：${res.address}。一齊去食？`;
    if (navigator.share) { navigator.share({ title: '搵食盲盒分享', text, url: window.location.href }).catch(console.error); }
    else { navigator.clipboard.writeText(text); alert('已複製分享文字！'); }
  };

  const addReview = (restaurantName: string, content: string) => {
    const review = { id: Date.now(), restaurantName, content, date: new Date().toLocaleDateString() };
    setUserReviews(prev => [review, ...prev]);
  };

  const displayedCuisines = isCuisineExpanded ? CUISINES : CUISINES.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <main className="flex-1 max-w-md mx-auto w-full px-6 pt-10 pb-40">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent italic tracking-tight">{t('title')}</h1>
          <div className="bg-slate-800/50 rounded-full px-4 py-1.5 border border-slate-700/50">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Ver 2.0</span>
          </div>
        </header>

        {activeTab === 'lottery' && (
          <div className="space-y-8">
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/10">
              <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="text-slate-200 text-xs font-black uppercase tracking-[0.2em]">{t('cuisine')}</h3>
                <button onClick={() => setIsCuisineExpanded(!isCuisineExpanded)} className="text-blue-400 text-[10px] font-black hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{isCuisineExpanded ? '摩埋' : '全部'}</button>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-10">
                {displayedCuisines.map(c => (
                  <button key={c.id} onClick={() => setSelectedCuisine(c.id)} className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all duration-300 active:scale-90 ${selectedCuisine === c.id ? 'bg-blue-500/20 border-blue-500 text-blue-100 shadow-[0_0_25px_rgba(59,130,246,0.15)]' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                    <span className="text-2xl mb-1.5">{c.icon}</span>
                    <span className="text-[10px] font-black tracking-tight">{c.name}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-8">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-slate-200 text-xs font-black uppercase tracking-[0.2em]">{t('distance')}</span>
                    <span className="text-blue-400 font-mono font-black text-xs bg-blue-500/10 px-2 py-0.5 rounded-md">{distance}m</span>
                  </div>
                  <input type="range" min="200" max="2000" step="100" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div className="flex justify-between items-center p-5 bg-slate-800/30 rounded-3xl border border-slate-700/30">
                  <span className="text-slate-200 text-xs font-black uppercase tracking-[0.2em]">{t('openNow')}</span>
                  <button onClick={() => setOpenNow(!openNow)} className={`w-12 h-6 rounded-full transition-all duration-300 relative ${openNow ? 'bg-blue-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${openNow ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            <button onClick={handleLottery} disabled={loading} className={`w-full h-24 rounded-[2.5rem] font-black text-xl transition-all duration-500 active:scale-95 shadow-2xl relative overflow-hidden ${loading ? 'bg-slate-800 text-slate-500' : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-900/40 hover:-translate-y-1'}`}>
              <div className="relative z-10 flex flex-col items-center justify-center">
                {loading ? ( <> <div className="w-5 h-5 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin mb-2"></div> <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{slotText}</span> </> ) : ( <> <span className="text-3xl mb-1">🎯</span> <span className="uppercase tracking-[0.2em] text-sm">{t('draw')}</span> </> )}
              </div>
            </button>

            {result && (
              <div className="space-y-6 pt-4">
                {result.error ? (
                  <div className="bg-slate-900/60 border border-slate-800/50 rounded-[2.5rem] p-10 text-center">
                    <span className="text-5xl mb-6 block">🍽️</span>
                    <p className="text-slate-400 font-bold text-sm leading-relaxed mb-6">{t('noResults')}</p>
                    <button onClick={() => setDistance(2000)} className="bg-blue-600/20 text-blue-400 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-500/20">加大搜尋範圍</button>
                  </div>
                ) : (
                  <>
                    <RestaurantCard res={result.main} isMain={true} favorites={favorites} onToggleFavorite={toggleFavorite} onShare={shareCard} reviews={userReviews} onAddReview={addReview} t={t} />
                    {result.alternatives && result.alternatives.length > 0 && (
                      <div className="pt-6">
                        <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 px-2 flex items-center gap-4">
                          <span className="flex-1 h-[1px] bg-slate-800"></span> {t('alternatives')} <span className="flex-1 h-[1px] bg-slate-800"></span>
                        </h3>
                        {result.alternatives.map((alt: any, idx: number) => (
                          <RestaurantCard key={idx} res={alt} favorites={favorites} onToggleFavorite={toggleFavorite} onShare={shareCard} reviews={userReviews} onAddReview={addReview} t={t} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-white mb-10 px-1">{t('favorites')}</h2>
            {favorites.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-slate-500 text-center italic">
                <span className="text-7xl mb-8 opacity-10">🍱</span>
                <p className="text-xs tracking-[0.2em] uppercase font-black">{t('noFavorites')}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {favorites.map((fav: any, i: number) => (
                  <div key={i} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 flex justify-between items-center hover:bg-slate-800/60 transition-all group shadow-lg shadow-black/20">
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1.5 group-hover:text-blue-400 transition-colors">{fav.name}</h3>
                      <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">📍 {fav.district || 'HK'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={fav.gmapsUrl} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-slate-700/50 hover:bg-slate-600 rounded-2xl transition-all">🗺️</a>
                      <button onClick={() => toggleFavorite(fav)} className="p-3.5 bg-slate-700/50 hover:bg-slate-600 rounded-2xl text-xl transition-all active:scale-90">❤️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-white mb-10 px-1">{t('settings')}</h2>
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8 space-y-12">
              <div className="space-y-6">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] px-1">Language / 語言選擇</label>
                <div className="bg-slate-800/60 rounded-3xl p-2 flex gap-2">
                  <button onClick={() => setLang('zh')} className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${lang === 'zh' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500'}`}>繁體中文</button>
                  <button onClick={() => setLang('en')} className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${lang === 'en' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500'}`}>English</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 p-8 pointer-events-none">
        <div className="max-w-md mx-auto bg-slate-900/80 backdrop-blur-3xl border border-slate-800/50 rounded-[2.5rem] flex justify-around items-center p-3 shadow-2xl shadow-black pointer-events-auto">
          <button onClick={() => setActiveTab('lottery')} className={`flex flex-col items-center gap-2.5 py-4 px-6 rounded-[2rem] transition-all duration-300 ${activeTab === 'lottery' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
            <span className="text-xl">🎰</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t('lottery')}</span>
          </button>
          <button onClick={() => setActiveTab('favorites')} className={`flex flex-col items-center gap-2.5 py-4 px-6 rounded-[2rem] transition-all duration-300 ${activeTab === 'favorites' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
            <span className="text-xl">❤️</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t('favorites')}</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-2.5 py-4 px-6 rounded-[2rem] transition-all duration-300 ${activeTab === 'settings' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
            <span className="text-xl">⚙️</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t('settings')}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
