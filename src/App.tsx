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

const LOCATIONS: any = {
  hk: [
    { name: '旺角', lat: 22.3193, lng: 114.1694 },
    { name: '尖沙咀', lat: 22.2988, lng: 114.1722 },
    { name: '銅鑼灣', lat: 22.2800, lng: 114.1850 },
    { name: '中環', lat: 22.2819, lng: 114.1581 },
    { name: '沙田', lat: 22.3817, lng: 114.1916 },
    { name: '荃灣', lat: 22.3693, lng: 114.1218 },
    { name: '元朗', lat: 22.4446, lng: 114.0292 },
  ],
  tw: [
    { name: '台北信義區', lat: 25.0330, lng: 121.5654 },
    { name: '西門町', lat: 25.0422, lng: 121.5082 },
    { name: '台中逢甲', lat: 24.1787, lng: 120.6468 },
  ]
};

const TRANSLATIONS: any = {
  zh: {
    title: '🎰 搵食盲盒',
    draw: '撳我抽盲盒！',
    cuisine: '菜式類型',
    distance: '距離',
    rating: '最低評分',
    openNow: '營業中',
    favorites: '收藏庫',
    settings: '設定',
    lottery: '抽獎',
    reviews: '評論',
    noFavorites: '仲未有收藏喎',
    address: '地址',
    openrice: '睇 OpenRice',
    gmaps: '開 Google Maps',
    any: '隨便',
    loading: '搜尋中...',
    share: '分享卡片',
    alternatives: '附近仲有...',
    writeReview: '寫低你嘅評論...',
    submitReview: '提交評論',
    noResults: '附近搵唔到餐廳，試吓較大個距離？',
    searchPlace: '輸入地點（如：旺角）',
    region: '選擇地區',
    suggested: '熱門地點',
  },
  en: {
    title: '🎰 Food Lottery',
    draw: 'Draw Now!',
    cuisine: 'Cuisine',
    distance: 'Distance',
    rating: 'Min Rating',
    openNow: 'Open Now',
    favorites: 'Favorites',
    settings: 'Settings',
    lottery: 'Draw',
    reviews: 'Reviews',
    noFavorites: 'No favorites yet',
    address: 'Address',
    openrice: 'OpenRice',
    gmaps: 'Google Maps',
    any: 'Any',
    loading: 'Searching...',
    share: 'Share Card',
    alternatives: 'Others Nearby...',
    writeReview: 'Write your review...',
    submitReview: 'Submit',
    noResults: 'No restaurants found nearby. Try increasing distance?',
    searchPlace: 'Enter location (e.g. Mong Kok)',
    region: 'Select Region',
    suggested: 'Suggested Locations',
  }
};

const logoUrl = "https://drive.google.com/thumbnail?id=1hzsBQTTjJ1BzyNRC9GkIE57YQmGNajO&sz=w800";

// --- Components ---
const RestaurantCard = ({ res, isMain = false, favorites = [], onToggleFavorite, onShare, reviews = [], onAddReview, t }: any) => {
  const [newReview, setNewReview] = useState('');
  if (!res || res.error) return null;
  const isFavorite = favorites.some((f: any) => f.name === res.name);

  return (
    <div className={`bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20 ${isMain ? 'p-8 scale-100' : 'p-6 opacity-90 scale-95 hover:scale-100 hover:opacity-100'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h2 className={`${isMain ? 'text-3xl' : 'text-xl'} font-black text-white mb-2 leading-tight`}>{res.name}</h2>
          <p className="text-slate-400 text-xs flex items-center gap-2">
            <span className="opacity-60 text-lg">📍</span> {res.address}
          </p>
        </div>
        <button 
          onClick={() => onToggleFavorite(res)}
          className="text-2xl p-4 rounded-[1.5rem] bg-slate-900/50 hover:bg-slate-700/50 transition-all duration-300 active:scale-75 border border-white/5"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-green-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {t('openNow')}
        </div>
        <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-500/10">
          ⭐ {res.rating || '4.2'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <a 
          href={res.openriceUrl} 
          target="_blank" 
          rel="noreferrer"
          className="bg-slate-900/50 hover:bg-slate-700/50 text-slate-200 py-4 rounded-2xl font-black text-[10px] transition-all text-center uppercase tracking-widest border border-white/5"
        >
          🥡 {t('openrice')}
        </a>
        <a 
          href={res.gmapsUrl} 
          target="_blank" 
          rel="noreferrer"
          className="bg-slate-900/50 hover:bg-slate-700/50 text-slate-200 py-4 rounded-2xl font-black text-[10px] transition-all text-center uppercase tracking-widest border border-white/5"
        >
          🗺️ {t('gmaps')}
        </a>
      </div>

      {isMain && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <button 
            onClick={() => onShare(res)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-5 rounded-2xl font-black text-xs transition-all shadow-2xl shadow-blue-900/40 uppercase tracking-[0.2em] border border-white/10 active:scale-[0.98]"
          >
            {t('share')}
          </button>

          <div className="pt-8 border-t border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black text-sm uppercase tracking-widest">{t('reviews')}</h3>
              <span className="bg-slate-900 text-slate-400 text-[10px] px-3 py-1 rounded-full font-black border border-white/5">
                {reviews.filter((r: any) => r.restaurantName === res.name).length}
              </span>
            </div>

            <div className="space-y-4 max-h-[250px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
              {reviews.filter((r: any) => r.restaurantName === res.name).length === 0 ? (
                <div className="text-slate-600 text-xs text-center py-8 italic bg-slate-900/30 rounded-3xl border border-dashed border-white/5">
                  仲未有評論...
                </div>
              ) : (
                reviews.filter((r: any) => r.restaurantName === res.name).map((r: any) => (
                  <div key={r.id} className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 animate-in slide-in-from-right-4 duration-500">
                    <p className="text-slate-200 text-xs leading-relaxed mb-3">{r.content}</p>
                    <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest">{r.date}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input 
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder={t('writeReview')}
                className="flex-1 bg-slate-900/80 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all focus:ring-4 focus:ring-blue-500/10"
              />
              <button 
                onClick={() => {
                  if (newReview.trim()) {
                    onAddReview(res.name, newReview);
                    setNewReview('');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white w-14 rounded-2xl transition-all shadow-lg active:scale-90 flex items-center justify-center border border-white/10"
              >
                🚀
              </button>
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
  const [region, setRegion] = useState('hk');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [userReviews, setUserReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('userReviews');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [distance, setDistance] = useState(800);
  const [openNow, setOpenNow] = useState(true);
  const [isCuisineExpanded, setIsCuisineExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCoords, setCurrentCoords] = useState<any>(null);
  const [slotText, setSlotText] = useState('');

  const slotOptions = ['正在分析您的口味...', '正在查看附近的美味...', '即將揭暁您的盲盒...', '正在挑選特色餐廳...', '尋找最佳食評中...'];

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('userReviews', JSON.stringify(userReviews));
  }, [userReviews]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Geolocation disabled or failed')
      );
    }
  }, []);

  const t = (key: string) => TRANSLATIONS[lang]?.[key] || key;

  const handleLottery = async () => {
    setLoading(true);
    setResult(null);
    const interval = setInterval(() => {
      setSlotText(slotOptions[Math.floor(Math.random() * slotOptions.length)]);
    }, 200);

    try {
      let lat = 22.3193, lng = 114.1694; // Default Mong Kok

      if (searchQuery) {
        // Try to find in suggested locations
        const found = LOCATIONS[region].find((l: any) => l.name.includes(searchQuery));
        if (found) {
          lat = found.lat;
          lng = found.lng;
        }
      } else if (currentCoords) {
        lat = currentCoords.lat;
        lng = currentCoords.lng;
      } else {
        // Fallback to GPS
        const pos: any = await new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej);
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }

      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radius: distance.toString(),
        category: selectedCuisine,
        open_now: openNow.toString()
      });

      try {
        const res = await fetch(`/api/lucky-restaurant?${params.toString()}`);
        const data = await res.json();
        
        setTimeout(() => {
          clearInterval(interval);
          setResult(data);
          setLoading(false);
          // Scroll to result
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }, 1500);
      } catch (err) {
        clearInterval(interval);
        setLoading(false);
        alert('API 請求失敗');
      }
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      // Fallback if search fails
      alert('請輸入地點或開啟定位');
    }
  };

  const toggleFavorite = (res: any) => {
    if (!res || !res.name) return;
    setFavorites((prev: any) => 
      prev.some((f: any) => f.name === res.name) 
        ? prev.filter((f: any) => f.name !== res.name)
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
    const review = { id: Date.now(), restaurantName, content, date: new Date().toLocaleDateString() };
    setUserReviews((prev: any) => [review, ...prev]);
  };

  const displayedCuisines = isCuisineExpanded ? CUISINES : CUISINES.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,58,138,0.2),transparent_50%)] pointer-events-none" />
      
      <header className="pt-12 pb-8 px-6 flex flex-col items-center relative">
        <img src={logoUrl} className="h-24 mb-4 object-contain animate-in fade-in zoom-in duration-1000" alt="Logo" />
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-black tracking-[0.3em] uppercase text-white/90">{t('title')}</h1>
          <span className="bg-blue-600/20 text-blue-400 text-[10px] px-3 py-1 rounded-full font-black border border-blue-500/20 tracking-widest">VER 2.1</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pb-32 relative">
        {activeTab === 'lottery' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Manual Search Section */}
            <section className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-700/50 space-y-6">
               <div className="space-y-4">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-black text-[10px] uppercase tracking-widest opacity-60">📍 {t('searchPlace')}</h3>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{region.toUpperCase()}</span>
                 </div>
                 <div className="relative group">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchPlace')}
                      className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all focus:ring-4 focus:ring-blue-500/10"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">✕</button>
                    )}
                 </div>
                 <div className="flex flex-wrap gap-2">
                    <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest mr-2 flex items-center">{t('suggested')}:</span>
                    {LOCATIONS[region].slice(0, 4).map((loc: any) => (
                      <button 
                        key={loc.name}
                        onClick={() => setSearchQuery(loc.name)}
                        className="bg-slate-900/50 hover:bg-slate-700/50 text-slate-400 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border border-white/5"
                      >
                        + {loc.name}
                      </button>
                    ))}
                 </div>
               </div>
            </section>

            {/* Cuisine Section */}
            <section className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-700/50 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-black text-[10px] uppercase tracking-widest opacity-60">{t('cuisine')}</h3>
                <button 
                  onClick={() => setIsCuisineExpanded(!isCuisineExpanded)}
                  className="text-blue-400 text-[9px] font-black hover:text-blue-300 bg-blue-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest transition-all"
                >
                  {isCuisineExpanded ? '收埋' : '顯示全部'}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {displayedCuisines.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => setSelectedCuisine(c.id)}
                    className={`flex flex-col items-center p-4 rounded-3xl border transition-all duration-300 active:scale-90 ${
                      selectedCuisine === c.id 
                        ? 'bg-blue-600 text-white border-blue-400 shadow-2xl shadow-blue-900/40' 
                        : 'bg-slate-900/50 border-white/5 text-slate-400'
                    }`}
                  >
                    <span className="text-xl mb-3">{c.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">{c.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Controls Section */}
            <section className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-700/50 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-white font-black text-[10px] uppercase tracking-widest opacity-60">{t('distance')}</h3>
                  <span className="bg-blue-600/20 text-blue-400 text-xs px-4 py-1.5 rounded-full font-black border border-blue-500/20">{distance}m</span>
                </div>
                <input 
                  type="range" min="200" max="2000" step="100"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <h3 className="text-white font-black text-[10px] uppercase tracking-widest opacity-60">{t('openNow')}</h3>
                </div>
                <button 
                  onClick={() => setOpenNow(!openNow)}
                  className={`w-14 h-7 rounded-full transition-all duration-300 relative border border-white/10 ${openNow ? 'bg-blue-600' : 'bg-slate-900'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-lg ${openNow ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
            </section>

            {/* Draw Button */}
            <button 
              onClick={handleLottery}
              disabled={loading}
              className="w-full group relative overflow-hidden h-28 rounded-[2.5rem] transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-gradient group-hover:scale-110 transition-transform duration-700" />
              <div className="relative flex flex-col items-center justify-center gap-1">
                {loading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white animate-pulse">{slotText}</span>
                  </div>
                ) : (
                  <>
                    <span className="text-3xl mb-1 group-hover:scale-125 transition-transform duration-500">🎯</span>
                    <span className="text-sm font-black uppercase tracking-[0.4em] text-white group-hover:tracking-[0.5em] transition-all duration-500">{t('draw')}</span>
                  </>
                )}
              </div>
            </button>

            {/* Result Section */}
            {result && (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
                {result.error ? (
                  <div className="bg-red-500/10 border border-red-500/20 p-12 rounded-[2.5rem] text-center space-y-4">
                    <span className="text-4xl block mb-4">🍽️</span>
                    <p className="text-red-400 font-black text-sm leading-relaxed">{t('noResults')}</p>
                    <button onClick={() => setDistance(2000)} className="text-red-400 text-[10px] font-black uppercase tracking-widest hover:underline">加大搜尋範圍</button>
                  </div>
                ) : (
                  <>
                    <RestaurantCard 
                      res={result.restaurant} 
                      isMain={true}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      onShare={shareCard}
                      reviews={userReviews}
                      onAddReview={addReview}
                      t={t}
                    />

                    {result.alternatives && result.alternatives.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-white/10" />
                          <h3 className="text-white font-black text-[10px] uppercase tracking-widest opacity-60">{t('alternatives')}</h3>
                          <div className="h-px flex-1 bg-white/10" />
                        </div>
                        <div className="space-y-6">
                          {result.alternatives.map((alt: any) => (
                            <RestaurantCard 
                              key={alt.name}
                              res={alt} 
                              favorites={favorites}
                              onToggleFavorite={toggleFavorite}
                              t={t}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            <h2 className="text-2xl font-black text-white mb-8">{t('favorites')}</h2>
            {favorites.length === 0 ? (
              <div className="bg-slate-800/40 p-20 rounded-[2.5rem] border border-slate-700/50 text-center space-y-6 border-dashed">
                <span className="text-5xl block opacity-40 grayscale">🍱</span>
                <p className="text-slate-500 font-black text-xs uppercase tracking-widest">{t('noFavorites')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {favorites.map((fav: any) => (
                  <div key={fav.name} className="bg-slate-800/60 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-slate-700/50 transition-all duration-300">
                    <div className="flex-1">
                      <h3 className="text-white font-black text-sm mb-2">{fav.name}</h3>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="opacity-50">📍</span> {fav.district || 'HK'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={fav.gmapsUrl} target="_blank" rel="noreferrer" className="p-3 bg-slate-900 text-slate-400 rounded-2xl hover:text-white transition-all border border-white/5 text-lg">🗺️</a>
                      <button 
                        onClick={() => toggleFavorite(fav)}
                        className="p-3 bg-slate-900 text-blue-400 rounded-2xl hover:scale-110 transition-all border border-white/5 text-lg"
                      >❤️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            <h2 className="text-2xl font-black text-white mb-8">{t('settings')}</h2>
            
            <section className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-700/50 space-y-6">
              <div>
                <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t('region')}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setRegion('hk')} className={`py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${region === 'hk' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'bg-slate-900/50 text-slate-500 border border-slate-700/50'}`}>Hong Kong 🇭🇰</button>
                  <button onClick={() => setRegion('tw')} className={`py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${region === 'tw' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'bg-slate-900/50 text-slate-500 border border-slate-700/50'}`}>Taiwan 🇹🇼</button>
                </div>
              </div>

              <div>
                <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Language / 語言選擇</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setLang('zh')} className={`py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${lang === 'zh' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'bg-slate-900/50 text-slate-500 border border-slate-700/50'}`}>繁體中文</button>
                  <button onClick={() => setLang('en')} className={`py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${lang === 'en' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'bg-slate-900/50 text-slate-500 border border-slate-700/50'}`}>English</button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 flex justify-between shadow-2xl shadow-black items-center z-50">
        <button onClick={() => setActiveTab('lottery')} className={`flex flex-col items-center gap-2.5 py-4 px-6 rounded-[2rem] transition-all duration-300 ${activeTab === 'lottery' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
          <span className="text-xl">🎰</span>
          <span className="text-[9px] font-black uppercase tracking-widest">{t('lottery')}</span>
        </button>
        <button onClick={() => setActiveTab('favorites')} className={`flex flex-col items-center gap-2.5 py-4 px-6 rounded-[2rem] transition-all duration-300 ${activeTab === 'favorites' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
          <span className="text-xl">❤️</span>
          <span className="text-[9px] font-black uppercase tracking-widest">{t('favorites')}</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-2.5 py-4 px-6 rounded-[2rem] transition-all duration-300 ${activeTab === 'settings' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
          <span className="text-xl">⚙️</span>
          <span className="text-[9px] font-black uppercase tracking-widest">{t('settings')}</span>
        </button>
      </nav>
    </div>
  );
}
