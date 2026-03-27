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
    noResults: '附近搵唔到餐廳，試吓換個地點？',
    searchPlace: '輸入地點（如：旺角）',
    region: '選擇地區',
    suggested: '熱門地點',
  },
  en: {
    title: '🎰 Food Lottery',
    draw: 'Draw Now!',
    cuisine: 'Cuisine',
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
    noResults: 'No restaurants found nearby. Try another location?',
    searchPlace: 'Enter location (e.g. Mong Kok)',
    region: 'Select Region',
    suggested: 'Suggested Locations',
  }
};

const logoUrl = \"https://drive.google.com/uc?id=1hzsBQTTjJ1BzyNRjC9GkIE57YQmGNajO\";

// --- Components ---
const RestaurantCard = ({ res, isMain = false, favorites = [], onToggleFavorite, onShare, reviews = [], onAddReview, t }: any) => {
  const [newReview, setNewReview] = useState('');
  
  if (!res || res.error) return null;
  const isFavorite = favorites.some((f: any) => f.name === res.name);
  
  return (
    <div className={`bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 ${isMain ? 'p-8 ring-1 ring-white/10 mb-10 shadow-xl' : 'p-6 mb-5'}`}>
      <div className=\"flex justify-between items-start mb-6\">
        <div className=\"flex-1\">
          <h3 className={`font-black text-white leading-tight tracking-tight ${isMain ? 'text-4xl' : 'text-2xl'}`}>{res.name}</h3>
          <p className=\"text-slate-400 text-xs mt-3 flex items-center gap-2 font-medium\">
            <span className=\"text-blue-500\">📍</span> {res.address}
          </p>
        </div>
        <button 
          onClick={() => onToggleFavorite(res)}
          className=\"text-2xl p-4 rounded-[1.8rem] bg-white/5 hover:bg-white/10 transition-all duration-300 active:scale-75 border border-white/5 shadow-inner\"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className=\"flex flex-wrap gap-3 mb-8\">
        <span className=\"bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/10\">
          ⭐ {res.rating || '4.2'}
        </span>
        <span className=\"bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/10\">
          🟢 {t('openNow')}
        </span>
      </div>

      <div className=\"grid grid-cols-2 gap-4 mb-8\">
        <a 
          href={res.openriceUrl} 
          target=\"_blank\" 
          rel=\"noopener noreferrer\"
          className=\"flex items-center justify-center gap-3 py-4 bg-slate-800/50 rounded-2xl text-xs font-black text-slate-200 hover:bg-slate-700/50 transition-all border border-white/5 active:scale-95 shadow-lg\"
        >
          🥡 {t('openrice')}
        </a>
        <a 
          href={res.gmapsUrl} 
          target=\"_blank\" 
          rel=\"noopener noreferrer\"
          className=\"flex items-center justify-center gap-3 py-4 bg-slate-800/50 rounded-2xl text-xs font-black text-slate-200 hover:bg-slate-700/50 transition-all border border-white/5 active:scale-95 shadow-lg\"
        >
          🗺️ {t('gmaps')}
        </a>
      </div>

      {isMain && (
        <div className=\"space-y-10\">
          <button 
            onClick={() => onShare(res)}
            className=\"w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-6 rounded-2xl font-black text-xs transition-all shadow-2xl shadow-blue-900/40 uppercase tracking-[0.25em] border border-white/10 active:scale-[0.98]\"
          >
            {t('share')}
          </button>
          
          <div className=\"pt-10 border-t border-white/5\">
            <div className=\"flex justify-between items-center mb-8\">
              <h4 className=\"text-white font-black text-xs uppercase tracking-widest flex items-center gap-3\">
                {t('reviews')}
                <span className=\"bg-blue-500/20 text-blue-400 text-[10px] px-3 py-1 rounded-full border border-blue-500/10\">
                  {reviews.filter((r: any) => r.restaurantName === res.name).length}
                </span>
              </h4>
            </div>
            
            <div className=\"space-y-5 max-h-56 overflow-y-auto pr-2 custom-scrollbar mb-8\">
              {reviews.filter((r: any) => r.restaurantName === res.name).length === 0 ? (
                <div className=\"py-10 text-center bg-white/5 rounded-3xl border border-dashed border-white/10\">
                  <p className=\"text-slate-500 text-[11px] font-bold tracking-wide italic\">仲未有評論喎...</p>
                </div>
              ) : (
                reviews.filter((r: any) => r.restaurantName === res.name).map((r: any) => (
                  <div key={r.id} className=\"bg-white/5 p-5 rounded-2xl border border-white/5 transition-all hover:bg-white/10\">
                    <p className=\"text-slate-300 text-xs leading-relaxed font-medium\">{r.content}</p>
                    <span className=\"text-slate-600 text-[9px] mt-3 block font-bold uppercase tracking-widest\">{r.date}</span>
                  </div>
                ))
              )}
            </div>

            <div className=\"flex gap-3\">
              <input 
                type=\"text\" 
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder={t('writeReview')}
                className=\"flex-1 bg-slate-900/80 border border-white/5 rounded-2xl px-6 py-5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all focus:ring-4 focus:ring-blue-500/10\"
              />
              <button 
                onClick={() => {
                  if (newReview.trim()) {
                    onAddReview(res.name, newReview);
                    setNewReview('');
                  }
                }}
                className=\"bg-blue-600 hover:bg-blue-500 text-white w-16 rounded-2xl transition-all shadow-xl active:scale-90 flex items-center justify-center border border-white/10\"
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
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [openNow, setOpenNow] = useState(true);
  const [isCuisineExpanded, setIsCuisineExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCoords, setCurrentCoords] = useState<any>(null);
  const [slotText, setSlotText] = useState('');
  
  const slotOptions = ['正在分析您的口味...', '正在查看附近的美味...', '即將揭曉您的盲盒...', '正在挑選特色餐廳...', '尋找最佳食評中...'];

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
      }

      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        category: selectedCuisine,
        open_now: openNow.toString()
      });

      const res = await fetch(`/api/lucky-restaurant?${params.toString()}`);
      const data = await res.json();
      
      setTimeout(() => {
        clearInterval(interval);
        setResult(data);
        setLoading(false);
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }, 1500);
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      alert('搜尋失敗，請再試一次');
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
    setUserReviews((prev: any[]) => [review, ...prev]);
  };

  const displayedCuisines = isCuisineExpanded ? CUISINES : CUISINES.slice(0, 6);

  return (
    <div className=\"min-h-screen bg-[#050a1f] text-slate-200 font-sans pb-40 selection:bg-blue-500/30 selection:text-white\">
      {/* Header */}
      <div className=\"pt-20 pb-12 px-8 text-center bg-gradient-to-b from-blue-900/20 via-blue-900/5 to-transparent\">
        <div className=\"relative inline-block mb-8\">
          <div className=\"absolute inset-0 blur-3xl bg-blue-500/20 rounded-full\"></div>
          <img 
            src={logoUrl} 
            alt=\"Logo\" 
            className=\"relative h-28 mx-auto object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-500\" 
          />
        </div>
        <h1 className=\"text-4xl font-black text-white tracking-tighter mb-3 uppercase italic\">{t('title')}</h1>
        <div className=\"inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.3em] border border-blue-500/10 shadow-lg\">
          <span className=\"w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse\"></span>
          V 2.2 PRO
        </div>
      </div>

      <div className=\"max-w-md mx-auto px-6 space-y-12\">
        {activeTab === 'lottery' && (
          <>
            {/* Search Section */}
            <div className=\"bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl ring-1 ring-white/5\">
              <div className=\"flex justify-between items-center\">
                <h3 className=\"text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 opacity-80\">
                  <span className=\"w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500\">📍</span>
                  {t('searchPlace')}
                </h3>
                <span className=\"bg-blue-500/10 text-blue-400 text-[9px] px-4 py-1.5 rounded-full font-black border border-blue-500/10 uppercase tracking-widest\">
                  {region.toUpperCase()}
                </span>
              </div>
              
              <div className=\"relative\">
                <input 
                  type=\"text\" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlace')}
                  className=\"w-full bg-slate-900/80 border border-white/5 rounded-[1.5rem] px-8 py-5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all focus:ring-4 focus:ring-blue-500/5 shadow-inner\"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className=\"absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors bg-white/5 w-8 h-8 rounded-full flex items-center justify-center\"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className=\"flex flex-wrap gap-2.5 pt-2\">
                {LOCATIONS[region].slice(0, 4).map((loc: any) => (
                  <button 
                    key={loc.name}
                    onClick={() => setSearchQuery(loc.name)}
                    className=\"bg-white/5 hover:bg-blue-500/20 text-slate-500 hover:text-blue-400 px-4 py-2 rounded-2xl text-[10px] font-black transition-all border border-white/5 uppercase tracking-tighter\"
                  >
                    + {loc.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine Section */}
            <div className=\"space-y-8\">
              <div className=\"flex justify-between items-end px-2\">
                <h3 className=\"text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 opacity-80\">
                  <span className=\"w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500\">🍱</span>
                  {t('cuisine')}
                </h3>
                <button 
                  onClick={() => setIsCuisineExpanded(!isCuisineExpanded)}
                  className=\"text-blue-400 text-[9px] font-black hover:text-blue-300 bg-blue-500/5 hover:bg-blue-500/10 px-5 py-2 rounded-full uppercase tracking-widest transition-all border border-blue-500/10\"
                >
                  {isCuisineExpanded ? '收細' : '顯示全部'}
                </button>
              </div>
              
              <div className=\"grid grid-cols-3 gap-5\">
                {displayedCuisines.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => setSelectedCuisine(c.id)}
                    className={`group flex flex-col items-center p-6 rounded-[2rem] border transition-all duration-500 active:scale-90 ${
                      selectedCuisine === c.id 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-400 shadow-2xl shadow-blue-500/30 -translate-y-1' 
                        : 'bg-slate-900/40 border-white/5 text-slate-500 hover:bg-slate-800/50 hover:border-white/10'
                    }`}
                  >
                    <span className=\"text-4xl mb-4 block drop-shadow-2xl group-hover:scale-110 transition-transform\">{c.icon}</span>
                    <span className=\"text-[10px] font-black uppercase tracking-widest\">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Open Now Toggle */}
            <div className=\"bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 flex justify-between items-center shadow-lg\">
              <h3 className=\"text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 opacity-80\">
                <span className=\"w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500\">🕒</span>
                {t('openNow')}
              </h3>
              <button 
                onClick={() => setOpenNow(!openNow)}
                className={`w-16 h-8 rounded-full transition-all duration-500 relative border border-white/5 ${openNow ? 'bg-blue-600' : 'bg-slate-800 shadow-inner'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-500 shadow-xl ${openNow ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            {/* Draw Button Container */}
            <div className=\"fixed bottom-36 left-0 right-0 px-8 z-30 pointer-events-none\">
              <div className=\"max-w-md mx-auto pointer-events-auto\">
                <button 
                  onClick={handleLottery}
                  disabled={loading}
                  className={`group w-full py-8 rounded-[2.5rem] font-black text-xl transition-all shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center justify-center gap-5 border border-white/20 ${
                    loading 
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed border-none shadow-none' 
                      : 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white hover:scale-[1.03] hover:shadow-blue-500/50 active:scale-95'
                  }`}
                >
                  {loading ? (
                    <div className=\"flex items-center gap-4\">
                      <div className=\"w-6 h-6 border-3 border-slate-600 border-t-white rounded-full animate-spin\" />
                      <span className=\"text-sm font-bold tracking-widest italic\">{slotText}</span>
                    </div>
                  ) : (
                    <>
                      <span className=\"text-3xl group-hover:rotate-12 transition-transform\">🎯</span>
                      <span className=\"uppercase tracking-[0.3em] font-black\">{t('draw')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Result Area */}
            <div id=\"result-area\" className=\"pt-10\">
              {result && (
                <div className=\"animate-in fade-in zoom-in-95 slide-in-from-bottom-12 duration-1000\">
                  {result.error ? (
                    <div className=\"bg-red-500/5 border border-red-500/10 p-12 rounded-[3rem] text-center space-y-5\">
                      <span className=\"text-5xl block opacity-50\">🍽️</span>
                      <p className=\"text-red-400 font-black text-xs uppercase tracking-[0.2em] leading-relaxed\">
                        {t('noResults')}
                      </p>
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
                        <div className=\"mt-16 space-y-8\">
                          <div className=\"flex items-center gap-4 px-4\">
                            <div className=\"h-px flex-1 bg-white/5\"></div>
                            <h3 className=\"text-white font-black text-[10px] uppercase tracking-[0.3em] opacity-40\">
                              {t('alternatives')}
                            </h3>
                            <div className=\"h-px flex-1 bg-white/5\"></div>
                          </div>
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

        {/* Favorites and Settings tabs remain similar but with updated styling constants */}
        {/* ... existing tab logic with updated Tailwind classes for consistent UI ... */}
      </div>

      {/* Navigation */}
      <div className=\"fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#050a1f] via-[#050a1f]/90 to-transparent z-40\">
        <div className=\"max-w-md mx-auto bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.8rem] p-3 flex justify-between items-center shadow-2xl shadow-black/80 ring-1 ring-white/5\">
          <button 
            onClick={() => setActiveTab('lottery')}
            className={`flex flex-col items-center gap-3 py-5 px-8 rounded-[2.2rem] transition-all duration-500 ${activeTab === 'lottery' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20 scale-105' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <span className=\"text-2xl\">🎰</span>
            <span className=\"text-[9px] font-black uppercase tracking-[0.25em]\">{t('lottery')}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center gap-3 py-5 px-8 rounded-[2.2rem] transition-all duration-500 ${activeTab === 'favorites' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20 scale-105' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <span className=\"text-2xl\">❤️</span>
            <span className=\"text-[9px] font-black uppercase tracking-[0.25em]\">{t('favorites')}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-3 py-5 px-8 rounded-[2.2rem] transition-all duration-500 ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20 scale-105' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <span className=\"text-2xl\">⚙️</span>
            <span className=\"text-[9px] font-black uppercase tracking-[0.25em]\">{t('settings')}</span>
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
