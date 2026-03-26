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
    { name: '高雄駁二', lat: 22.6191, lng: 120.2815 },
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

const logoUrl = "https://drive.google.com/uc?id=1hzsBQTTjJ1BzyNRjC9GkIE57YQmGNajO";

// --- Components ---
const RestaurantCard = ({ res, isMain = false, favorites = [], onToggleFavorite, onShare, reviews = [], onAddReview, t }: any) => {
  const [newReview, setNewReview] = useState('');
  if (!res || res.error) return null;
  const isFavorite = favorites.some((f: any) => f.name === res.name);

  return (
    <div className={`bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20 ${isMain ? 'p-8 ring-2 ring-blue-500/20 mb-8' : 'p-6 mb-4'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className={`font-black text-white leading-tight ${isMain ? 'text-4xl' : 'text-2xl'}`}>{res.name}</h3>
          <p className="text-slate-400 text-xs mt-3 flex items-center gap-2">
            <span className="text-blue-500">📍</span> {res.address}
          </p>
        </div>
        <button
          onClick={() => onToggleFavorite(res)}
          className="text-2xl p-4 rounded-[1.5rem] bg-slate-900/50 hover:bg-slate-700/50 transition-all duration-300 active:scale-75 border border-white/5"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <span className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
          🟢 {t('openNow')}
        </span>
        <span className="bg-amber-500/10 text-amber-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
          ⭐ {res.rating || '4.2'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <a
          href={res.openriceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-4 bg-slate-900/80 rounded-2xl text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all border border-white/5 active:scale-95"
        >
          🥡 {t('openrice')}
        </a>
        <a
          href={res.gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-4 bg-slate-900/80 rounded-2xl text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all border border-white/5 active:scale-95"
        >
          🗺️ {t('gmaps')}
        </a>
      </div>

      {isMain && (
        <div className="space-y-8">
          <button
            onClick={() => onShare(res)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-5 rounded-2xl font-black text-xs transition-all shadow-2xl shadow-blue-900/40 uppercase tracking-[0.2em] border border-white/10 active:scale-[0.98]"
          >
            {t('share')}
          </button>

          <div className="pt-8 border-t border-white/5">
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-3">
              {t('reviews')}
              <span className="bg-slate-700 text-[9px] px-2 py-0.5 rounded-full">
                {reviews.filter((r: any) => r.restaurantName === res.name).length}
              </span>
            </h4>
            
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar mb-6">
              {reviews.filter((r: any) => r.restaurantName === res.name).length === 0 ? (
                <p className="text-slate-500 text-[10px] italic py-4">仲未有評論...</p>
              ) : (
                reviews.filter((r: any) => r.restaurantName === res.name).map((r: any) => (
                  <div key={r.id} className="bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-slate-300 text-xs leading-relaxed">{r.content}</p>
                    <span className="text-slate-600 text-[9px] mt-2 block">{r.date}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
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
  const [result, setResult] = useState(null);
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
  const [currentCoords, setCurrentCoords] = useState(null);
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
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-32">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center bg-gradient-to-b from-blue-600/10 to-transparent">
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="h-24 mx-auto mb-4 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
        />
        <h1 className="text-3xl font-black text-white tracking-tighter mb-1">{t('title')}</h1>
        <div className="inline-block bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-[10px] font-black tracking-widest border border-blue-500/20">
          VER 2.1
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-12">
        {activeTab === 'lottery' && (
          <>
            {/* Manual Search Section */}
            <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-3">
                  <span className="text-blue-500">📍</span> {t('searchPlace')}
                </h3>
                <span className="bg-blue-500/10 text-blue-400 text-[9px] px-3 py-1 rounded-full font-black border border-blue-500/20 uppercase tracking-widest">
                  {region.toUpperCase()}
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlace')}
                  className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all focus:ring-4 focus:ring-blue-500/10"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-slate-500 text-[10px] w-full mb-1 font-bold">{t('suggested')}:</span>
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

            {/* Cuisine Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-3">
                  <span className="text-blue-500">🍱</span> {t('cuisine')}
                </h3>
                <button 
                  onClick={() => setIsCuisineExpanded(!isCuisineExpanded)}
                  className="text-blue-400 text-[9px] font-black hover:text-blue-300 bg-blue-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest transition-all"
                >
                  {isCuisineExpanded ? '收埋' : '顯示全部'}
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
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
                    <span className="text-3xl mb-3 block drop-shadow-lg">{c.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Section */}
            <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-3">
                    <span className="text-blue-500">📏</span> {t('distance')}
                  </h3>
                  <span className="text-blue-400 font-black text-sm">{distance}m</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-3">
                  <span className="text-blue-500">🕒</span> {t('openNow')}
                </h3>
                <button
                  onClick={() => setOpenNow(!openNow)}
                  className={`w-14 h-7 rounded-full transition-all duration-300 relative border border-white/10 ${openNow ? 'bg-blue-600' : 'bg-slate-900'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${openNow ? 'right-1 shadow-lg' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Draw Button */}
            <div className="fixed bottom-32 left-0 right-0 px-6 z-20 pointer-events-none">
              <div className="max-w-md mx-auto pointer-events-auto">
                <button
                  onClick={handleLottery}
                  disabled={loading}
                  className={`w-full py-7 rounded-[2rem] font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-4 border border-white/10 ${
                    loading 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-95 shadow-blue-900/40'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                      <span className="text-sm italic">{slotText}</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-2xl">🎯</span>
                      <span className="uppercase tracking-[0.2em]">{t('draw')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Result Section */}
            <div id="result-area" className="pt-8">
              {result && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {result.error ? (
                    <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2.5rem] text-center space-y-4">
                      <span className="text-4xl block">🍽️</span>
                      <p className="text-red-400 font-black text-xs uppercase tracking-widest leading-relaxed">
                        {t('noResults')}
                      </p>
                      <button 
                        onClick={() => setDistance(2000)}
                        className="text-red-400 text-[10px] font-black uppercase tracking-widest hover:underline"
                      >
                        加大搜尋範圍
                      </button>
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
                        <div className="mt-12 space-y-6">
                          <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 px-2">
                            <span className="text-blue-500">🍱</span> {t('alternatives')}
                          </h3>
                          {result.alternatives.map((alt: any) => (
                            <RestaurantCard 
                              key={alt.name} 
                              res={alt} 
                              favorites={favorites} 
                              onToggleFavorite={toggleFavorite}
                              reviews={userReviews}
                              onAddReview={addReview}
                              t={t}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-8 pt-4">
            <h2 className="text-3xl font-black text-white tracking-tighter">{t('favorites')}</h2>
            <div className="space-y-4">
              {favorites.length === 0 ? (
                <div className="bg-slate-900/40 p-12 rounded-[2.5rem] text-center border border-white/5 space-y-4 mt-8">
                  <span className="text-4xl block opacity-30">🍱</span>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest leading-relaxed">
                    {t('noFavorites')}
                  </p>
                </div>
              ) : (
                favorites.map((fav: any) => (
                  <div key={fav.name} className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-slate-800/60 transition-all">
                    <div>
                      <h3 className="text-white font-black text-lg group-hover:text-blue-400 transition-colors">{fav.name}</h3>
                      <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest">
                        <span className="text-blue-500">📍</span> {fav.district || 'HK'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={fav.gmapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-900 text-slate-400 rounded-2xl hover:text-white transition-all border border-white/5"
                      >
                        🗺️
                      </a>
                      <button 
                        onClick={() => toggleFavorite(fav)}
                        className="p-3 bg-slate-900 text-blue-400 rounded-2xl hover:scale-110 transition-all border border-white/5 text-lg"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-12 pt-4">
            <h2 className="text-3xl font-black text-white tracking-tighter">{t('settings')}</h2>
            
            <div className="space-y-8">
              <div className="space-y-6">
                <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">{t('region')}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setRegion('hk')}
                    className={`py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${region === 'hk' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'bg-slate-900/50 text-slate-500 border border-slate-700/50'}`}
                  >
                    Hong Kong 🇭🇰
                  </button>
                  <button 
                    onClick={() => setRegion('tw')}
                    className={`py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${region === 'tw' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'bg-slate-900/50 text-slate-500 border border-slate-700/50'}`}
                  >
                    Taiwan 🇹🇼
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">Language / 語言選擇</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setLang('zh')}
                    className={`py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${lang === 'zh' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'bg-slate-900/50 text-slate-500 border border-slate-700/50'}`}
                  >
                    繁體中文
                  </button>
                  <button 
                    onClick={() => setLang('en')}
                    className={`py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${lang === 'en' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'bg-slate-900/50 text-slate-500 border border-slate-700/50'}`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent z-10">
        <div className="max-w-md mx-auto bg-slate-900/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-3 flex justify-between items-center shadow-2xl shadow-black/50">
          <button 
            onClick={() => setActiveTab('lottery')}
            className={`flex flex-col items-center gap-2.5 py-4 px-6 rounded-[2rem] transition-all duration-300 ${activeTab === 'lottery' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="text-xl">🎰</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{t('lottery')}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center gap-2.5 py-4 px-6 rounded-[2rem] transition-all duration-300 ${activeTab === 'favorites' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="text-xl">❤️</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{t('favorites')}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-2.5 py-4 px-6 rounded-[2rem] transition-all duration-300 ${activeTab === 'settings' ? 'bg-blue-500/10 text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="text-xl">⚙️</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{t('settings')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
