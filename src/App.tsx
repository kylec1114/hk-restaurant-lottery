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
    hide: '收埋',
    showAll: '顯示全部',
    searchFailed: '搜尋失敗，請再試一次',
    copied: '已複製分享文字！',
    increaseRange: '加大搜尋範圍',
    noReviews: '仲未有評論...',
    langSelect: 'Language / 語言選擇',
    resultsNotOut: '結果仲未出',
    slot1: '正在分析您的口味...',
    slot2: '正在查看附近的美味...',
    slot3: '即將揭暁您的盲盒...',
    slot4: '正在挑選特色餐廳...',
    slot5: '尋找最佳食評中...',
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
    hide: 'Hide',
    showAll: 'Show All',
    searchFailed: 'Search failed, please try again',
    copied: 'Share text copied!',
    increaseRange: 'Increase search range',
    noReviews: 'No reviews yet...',
    langSelect: 'Language Selection',
    resultsNotOut: 'Results not yet out',
    slot1: 'Analyzing your taste...',
    slot2: 'Checking nearby delicacies...',
    slot3: 'Revealing your blind box soon...',
    slot4: 'Picking featured restaurants...',
    slot5: 'Finding best reviews...',
  }
};

const logoUrl = "https://drive.google.com/uc?id=1hzsBQTTjJ1BzyNRjC9GkIE57YQmGNajO";

// --- Components ---
const RestaurantCard = ({ res, isMain = false, favorites = [], onToggleFavorite, onShare, reviews = [], onAddReview, t }: any) => {
  const [newReview, setNewReview] = useState('');
  if (!res || res.error) return null;
  const isFavorite = favorites.some((f: any) => f.name === res.name);

  return (
    <div className={`bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500 hover:border-blue-500/30 ${isMain ? 'shadow-2xl shadow-blue-900/20 active:scale-[0.99]' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{res.name}</h3>
          <p className="text-slate-500 text-xs flex items-center gap-2">
            <span className="text-blue-400">📍</span> {res.address}
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
        <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-500/20">
          🟢 {t('openNow')}
        </div>
        <div className="bg-amber-500/10 text-amber-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
          ⭐ {res.rating || '4.2'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <a
          href={res.openriceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-800 text-slate-300 py-4 rounded-2xl text-[10px] font-black transition-all border border-white/5 uppercase tracking-widest"
        >
          🥡 {t('openrice')}
        </a>
        <a
          href={res.gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-800 text-slate-300 py-4 rounded-2xl text-[10px] font-black transition-all border border-white/5 uppercase tracking-widest"
        >
          🗺️ {t('gmaps')}
        </a>
      </div>

      {isMain && (
        <div className="space-y-6">
          <button
            onClick={() => onShare(res)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-5 rounded-2xl font-black text-xs transition-all shadow-2xl shadow-blue-900/40 uppercase tracking-[0.2em] border border-white/10 active:scale-[0.98]"
          >
            {t('share')}
          </button>

          <div className="pt-6 border-t border-white/5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
              <span>{t('reviews')}</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded-md text-slate-400">{reviews.filter((r: any) => r.restaurantName === res.name).length}</span>
            </h4>
            
            <div className="space-y-3 mb-6 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {reviews.filter((r: any) => r.restaurantName === res.name).length === 0 ? (
                <div className="text-slate-600 text-[10px] py-4 text-center italic">{t('noReviews')}</div>
              ) : (
                reviews.filter((r: any) => r.restaurantName === res.name).map((r: any) => (
                  <div key={r.id} className="bg-slate-900/30 p-4 rounded-2xl border border-white/5">
                    <p className="text-slate-300 text-xs leading-relaxed">{r.content}</p>
                    <span className="text-[8px] text-slate-600 mt-2 block font-bold">{r.date}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
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
    } catch {
      return [];
    }
  });
  const [userReviews, setUserReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('userReviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [distance, setDistance] = useState(800);
  const [openNow, setOpenNow] = useState(true);
  const [isCuisineExpanded, setIsCuisineExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCoords, setCurrentCoords] = useState(null);
  const [slotText, setSlotText] = useState('');

  const slotOptions = useMemo(() => [
    t('slot1'), t('slot2'), t('slot3'), t('slot4'), t('slot5')
  ], [lang]);

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
        const found = LOCATIONS[region].find((l: any) => l.name.includes(searchQuery));
        if (found) {
          lat = found.lat;
          lng = found.lng;
        }
      } else if (currentCoords) {
        lat = currentCoords.lat;
        lng = currentCoords.lng;
      } else {
        try {
          const pos: any = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch (e) {
          console.log('Using default Mong Kok coordinates');
        }
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
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 1500);

    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      alert(t('searchFailed'));
    }
  };

  const toggleFavorite = (res: any) => {
    if (!res || !res.name) return;
    setFavorites((prev: any[]) => 
      prev.some((f: any) => f.name === res.name)
        ? prev.filter((f: any) => f.name !== res.name)
        : [...prev, res]
    );
  };

  const shareCard = (res: any) => {
    const text = lang === 'zh' 
      ? `我抽到呢間餐廳：${res.name}！📍 地址：${res.address}。一齊去食？`
      : `I drew this restaurant: ${res.name}! 📍 Address: ${res.address}. Let's go?`;
    
    if (navigator.share) {
      navigator.share({
        title: t('title'),
        text,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert(t('copied'));
    }
  };

  const addReview = (restaurantName: string, content: string) => {
    const review = {
      id: Date.now(),
      restaurantName,
      content,
      date: new Date().toLocaleDateString()
    };
    setUserReviews((prev: any[]) => [review, ...prev]);
  };

  const displayedCuisines = isCuisineExpanded ? CUISINES : CUISINES.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="p-8 pt-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        <div className="inline-block mb-6 relative">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl rotate-12 shadow-2xl shadow-blue-900/40 flex items-center justify-center border border-white/20">
            <img src={logoUrl} alt="Logo" className="w-12 h-12 -rotate-12 object-contain" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{t('title')}</h1>
        <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-1 rounded-full border border-blue-500/20">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">VER 2.1</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pb-40">
        {activeTab === 'lottery' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Manual Search Section */}
            <section>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="text-blue-400">📍</span> {t('searchPlace')}
                <span className="ml-auto bg-slate-800 px-2 py-0.5 rounded text-blue-400">{region.toUpperCase()}</span>
              </h3>
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
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-[9px] text-slate-600 font-bold uppercase py-1.5">{t('suggested')}:</span>
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
            </section>

            {/* Cuisine Section */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="text-blue-400">🍱</span> {t('cuisine')}
                </h3>
                <button
                  onClick={() => setIsCuisineExpanded(!isCuisineExpanded)}
                  className="text-blue-400 text-[9px] font-black hover:text-blue-300 bg-blue-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest transition-all"
                >
                  {isCuisineExpanded ? t('hide') : t('showAll')}
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
                    <span className="text-2xl mb-2">{c.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider">{c.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Controls Section */}
            <section className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="text-blue-400">📏</span> {t('distance')}
                  </h3>
                  <span className="text-blue-400 text-xs font-black">{distance}m</span>
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
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="text-blue-400">🕒</span> {t('openNow')}
                </h3>
                <button
                  onClick={() => setOpenNow(!openNow)}
                  className={`w-14 h-7 rounded-full transition-all duration-300 relative border border-white/10 ${openNow ? 'bg-blue-600' : 'bg-slate-900'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${openNow ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
            </section>

            {/* Draw Button */}
            <div className="relative pt-4">
              <button
                onClick={handleLottery}
                disabled={loading}
                className={`w-full py-8 rounded-[2.5rem] font-black text-lg transition-all duration-500 shadow-2xl relative overflow-hidden group ${
                  loading 
                    ? 'bg-slate-900 text-blue-400 cursor-wait' 
                    : 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white hover:scale-[1.02] active:scale-95'
                }`}
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl animate-bounce mb-2">🎰</div>
                    <div className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">
                      {slotText}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="flex items-center justify-center gap-3">
                      <span className="text-2xl animate-spin-slow">🎯</span>
                      <span className="uppercase tracking-[0.2em]">{t('draw')}</span>
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Result Section */}
            {result && (
              <div className="animate-in zoom-in-95 fade-in duration-500">
                {result.error ? (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-[2.5rem] p-12 text-center">
                    <div className="text-4xl mb-6">🍽️</div>
                    <p className="text-slate-400 text-sm mb-6 font-medium leading-relaxed">{t('noResults')}</p>
                    <button
                      onClick={() => setDistance(2000)}
                      className="text-red-400 text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      {t('increaseRange')}
                    </button>
                  </div>
                ) : (
                  <>
                    <RestaurantCard
                      res={result}
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
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 px-4">
                          <span className="text-blue-400">🍱</span> {t('alternatives')}
                        </h3>
                        <div className="space-y-4">
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
            
            {/* Results Not Yet Out Fallback */}
            {!result && !loading && (
              <div className="text-center py-12 opacity-30">
                <div className="text-4xl mb-4 grayscale">🍱</div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {t('resultsNotOut')}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-black text-white mb-8 tracking-tight">{t('favorites')}</h2>
            {favorites.length === 0 ? (
              <div className="bg-slate-900/40 rounded-[2.5rem] p-20 text-center border border-white/5">
                <div className="text-5xl mb-6 grayscale">🍱</div>
                <p className="text-slate-500 text-sm font-medium">{t('noFavorites')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((fav: any) => (
                  <div key={fav.name} className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 flex items-center gap-6 group">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white mb-1 group-hover:text-blue-400 transition-colors">{fav.name}</h3>
                      <p className="text-slate-500 text-[10px] flex items-center gap-2 font-bold uppercase tracking-wider">
                        <span className="text-blue-400">📍</span> {fav.district || 'HK'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a href={fav.gmapsUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 text-slate-400 rounded-2xl hover:text-white transition-all border border-white/5">🗺️</a>
                      <button
                        onClick={() => toggleFavorite(fav)}
                        className="p-3 bg-slate-900 text-blue-400 rounded-2xl hover:scale-110 transition-all border border-white/5 text-lg"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-black text-white mb-8 tracking-tight">{t('settings')}</h2>
            
            <div className="space-y-8">
              <section>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{t('region')}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRegion('hk')}
                    className={`py-5 rounded-[2rem] text-xs font-black transition-all uppercase tracking-widest border ${
                      region === 'hk' 
                        ? 'bg-blue-600 text-white border-blue-400 shadow-2xl shadow-blue-900/40' 
                        : 'bg-slate-900/50 text-slate-500 border-white/5'
                    }`}
                  >
                    Hong Kong 🇭🇰
                  </button>
                  <button
                    onClick={() => setRegion('tw')}
                    className={`py-5 rounded-[2rem] text-xs font-black transition-all uppercase tracking-widest border ${
                      region === 'tw' 
                        ? 'bg-blue-600 text-white border-blue-400 shadow-2xl shadow-blue-900/40' 
                        : 'bg-slate-900/50 text-slate-500 border-white/5'
                    }`}
                  >
                    Taiwan 🇹🇼
                  </button>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{t('langSelect')}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setLang('zh')}
                    className={`py-5 rounded-[2rem] text-xs font-black transition-all uppercase tracking-widest border ${
                      lang === 'zh' 
                        ? 'bg-blue-600 text-white border-blue-400 shadow-2xl shadow-blue-900/40' 
                        : 'bg-slate-900/50 text-slate-500 border-white/5'
                    }`}
                  >
                    繁體中文
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={`py-5 rounded-[2rem] text-xs font-black transition-all uppercase tracking-widest border ${
                      lang === 'en' 
                        ? 'bg-blue-600 text-white border-blue-400 shadow-2xl shadow-blue-900/40' 
                        : 'bg-slate-900/50 text-slate-500 border-white/5'
                    }`}
                  >
                    English
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/60 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-3 shadow-2xl z-50 flex items-center justify-around">
        {[
          { id: 'lottery', icon: '🎰', label: t('lottery') },
          { id: 'favorites', icon: '❤️', label: t('favorites') },
          { id: 'settings', icon: '⚙️', label: t('settings') }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-3xl transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
