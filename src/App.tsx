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
    { name: '高雄駁二', lat: 22.6200, lng: 120.2814 },
  ]
};

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
    noResults: '附近搵唔到餐廳，試吓輸入其他地點？',
    searchPlace: '輸入地點（如：旺角）',
    region: '地區 / 國家',
    savedPlaces: '儲存地點',
    suggested: '建議地點'
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
    noResults: 'No restaurants found. Try searching for another place?',
    searchPlace: 'Enter place (e.g. Mong Kok)',
    region: 'Region / Country',
    savedPlaces: 'Saved Places',
    suggested: 'Suggested'
  }
};

// --- Components ---
const RestaurantCard = ({ res, isMain = false, favorites = [], onToggleFavorite, onShare, reviews = [], onAddReview, t }: any) => {
  const [newReview, setNewReview] = useState('');
  if (!res || res.error) return null;
  const isFavorite = favorites.some((f: any) => f.name === res.name);

  return (
    <div className={`bg-slate-800/60 backdrop-blur-xl rounded-[2.5rem] border border-slate-700/50 p-8 mb-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 ${isMain ? 'shadow-2xl shadow-blue-900/20' : 'opacity-80'}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-black text-white leading-tight">{res.name}</h3>
        <button onClick={() => onToggleFavorite(res)} className="text-2xl p-2.5 rounded-2xl bg-slate-700/50 hover:bg-slate-600 transition-all active:scale-90">
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">📍 {res.address}</p>
      
      <div className="flex gap-3 mb-8">
        <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {t('openNow')}
        </span>
        <span className="px-4 py-2 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20 flex items-center gap-1.5">
          ⭐ {res.rating || '4.2'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <a href={res.openriceUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-900 text-white py-4 rounded-2xl text-xs font-black transition-all border border-slate-700/50 uppercase tracking-wider">
          🥡 {t('openrice')}
        </a>
        <a href={res.gmapsUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-900 text-white py-4 rounded-2xl text-xs font-black transition-all border border-slate-700/50 uppercase tracking-wider">
          🗺️ {t('gmaps')}
        </a>
      </div>

      {isMain && (
        <div className="space-y-6 animate-in fade-in duration-700 delay-300">
          <button onClick={() => onShare(res)} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-900/30 uppercase tracking-widest">
            {t('share')}
          </button>
          
          <div className="pt-6 border-t border-slate-700/50">
            <h4 className="text-slate-200 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              {t('reviews')} <span className="px-2 py-0.5 bg-slate-700 rounded-md text-[9px]">{reviews.filter((r: any) => r.restaurantName === res.name).length}</span>
            </h4>
            
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {reviews.filter((r: any) => r.restaurantName === res.name).length === 0 ? (
                <p className="text-slate-500 text-[10px] italic">仲未有評論...</p>
              ) : (
                reviews.filter((r: any) => r.restaurantName === res.name).map((r: any) => (
                  <div key={r.id} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/30">
                    <p className="text-slate-300 text-[11px] leading-relaxed mb-1">{r.content}</p>
                    <span className="text-[9px] text-slate-500">{r.date}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input 
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder={t('writeReview')}
                className="flex-1 bg-slate-900 border border-slate-700/50 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
              />
              <button 
                onClick={() => {
                  if (newReview.trim()) {
                    onAddReview(res.name, newReview);
                    setNewReview('');
                  }
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white w-12 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-90 flex items-center justify-center"
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
  const [searchQuery, setSearchPlace] = useState('');
  const [currentCoords, setCurrentCoords] = useState<any>(null);
  const [slotText, setSlotText] = useState('');

  const slotOptions = ['正在分析您的口味...', '正在查看附近的美味...', '即將揭暁您的盲盒...', '正在挑選特色餐廳...', '尋找最佳食評中...'];

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('userReviews', JSON.stringify(userReviews));
  }, [userReviews]);

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

      const res = await fetch(`/api/lucky-restaurant?${params.toString()}`);
      const data = await res.json();
      
      setTimeout(() => {
        clearInterval(interval);
        setResult(data);
        setLoading(false);
      }, 1500);
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      alert('無法獲取位置或 API 請求失敗');
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

  const logoUrl = "https://lh3.googleusercontent.com/sitesv/APaQ0SRbovrtKlDRp6OTjVAPiQe8sSHwejjjUqfFX171ugsrx33Ylqij1f4_YJ4YGT9_rG8yqKDz7gSfHN9rX3Yg9yBj8k9zBODSvsZ0ygCxP4YOzoO1ibW_do5E7gSB6kUeUL_bzt_P_Oe70bAdbO_qMtQ7uwjSTTtyY0_2bme-0NieWrNAy7TNaybuJMyYG_uJeoRz3AUW_KNFx5h1k8t0n-7RRCZ0P5aPy3fJxHg=w1280";

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-6 pb-32 selection:bg-blue-500/30">
      {/* Header / Logo */}
      <div className="flex flex-col items-center mb-12 animate-in fade-in zoom-in duration-1000">
        <img src={logoUrl} alt="Logo" className="h-24 mb-4 object-contain" />
        <div className="px-4 py-1.5 bg-slate-800/50 backdrop-blur-md rounded-full border border-slate-700/50 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] shadow-xl">
          Ver 2.1
        </div>
      </div>

      <main className="max-w-md mx-auto space-y-10">
        {activeTab === 'lottery' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Location Search Section */}
            <section className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50">
              <h3 className="text-slate-200 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">📍 {t('searchPlace')}</h3>
              <div className="relative mb-4">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchPlace(e.target.value)}
                  placeholder={t('searchPlace')}
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all pr-12"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400">🔍</button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {LOCATIONS[region].slice(0, 4).map((loc: any) => (
                  <button 
                    key={loc.name}
                    onClick={() => setSearchPlace(loc.name)}
                    className="px-3 py-1.5 bg-slate-700/30 hover:bg-slate-700 rounded-lg text-[10px] text-slate-400 hover:text-white transition-all border border-slate-700/50"
                  >
                    + {loc.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Cuisine Selector */}
            <section>
              <div className="flex justify-between items-end mb-6 px-2">
                <h3 className="text-slate-200 text-xs font-black uppercase tracking-widest flex items-center gap-2">🍽️ {t('cuisine')}</h3>
                <button onClick={() => setIsCuisineExpanded(!isCuisineExpanded)} className="text-blue-400 text-[10px] font-black hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                  {isCuisineExpanded ? '收埋' : '全部'}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {displayedCuisines.map(c => (
                  <button key={c.id} onClick={() => setSelectedCuisine(c.id)} className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all duration-300 active:scale-90 ${selectedCuisine === c.id ? 'bg-blue-500/20 border-blue-500 text-blue-100 shadow-[0_0_25px_rgba(59,130,246,0.15)]' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                    <span className="text-2xl mb-2">{c.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{c.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Distance & Open Now */}
            <section className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-700/50 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-slate-400">{t('distance')}</span>
                  <span className="text-blue-400">{distance}m</span>
                </div>
                <input type="range" min="200" max="2000" step="100" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>

              <div className="flex justify-between items-center py-2 border-t border-slate-700/30 pt-6">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">{t('openNow')}</span>
                <button onClick={() => setOpenNow(!openNow)} className={`w-12 h-6 rounded-full transition-all duration-300 relative ${openNow ? 'bg-blue-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${openNow ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </section>

            {/* Draw Button */}
            <button onClick={handleLottery} disabled={loading} className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-blue-900/40 active:scale-95 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? ( <span className="flex items-center justify-center gap-3"><span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span> {slotText}</span> ) : ( <span className="flex items-center justify-center gap-3">🎯 {t('draw')}</span> )}
            </button>

            {/* Result Area */}
            {result && (
              <div className="space-y-6">
                {result.error ? (
                  <div className="text-center py-12 bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50">
                    <div className="text-4xl mb-4 opacity-50">🍽️</div>
                    <p className="text-slate-400 text-sm font-medium mb-6 px-8">{t('noResults')}</p>
                    <button onClick={() => setDistance(2000)} className="bg-blue-600/20 text-blue-400 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-500/20">加大搜尋範圍</button>
                  </div>
                ) : (
                  <>
                    <RestaurantCard res={result} isMain={true} favorites={favorites} onToggleFavorite={toggleFavorite} onShare={shareCard} reviews={userReviews} onAddReview={addReview} t={t} />
                    {result.alternatives && result.alternatives.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-slate-700/50">
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] px-2">{t('alternatives')}</h3>
                        {result.alternatives.map((alt: any) => (
                          <RestaurantCard key={alt.name} res={alt} favorites={favorites} onToggleFavorite={toggleFavorite} t={t} />
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
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-2xl font-black text-white mb-8">{t('favorites')}</h2>
            {favorites.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50 border-dashed">
                <div className="text-4xl mb-4 opacity-20">🍱</div>
                <p className="text-slate-500 text-sm">{t('noFavorites')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((fav: any) => (
                  <div key={fav.name} className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/50 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{fav.name}</h3>
                      <p className="text-slate-400 text-xs">📍 {fav.district || 'HK'}</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={fav.gmapsUrl} target="_blank" rel="noreferrer" className="p-3.5 bg-slate-700/50 hover:bg-slate-600 rounded-2xl transition-all">🗺️</a>
                      <button onClick={() => toggleFavorite(fav)} className="p-3.5 bg-slate-700/50 hover:bg-slate-600 rounded-2xl text-lg transition-all active:scale-90">❤️</button>
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
