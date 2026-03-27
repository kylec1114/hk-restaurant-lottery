import { useState, useEffect, useMemo } from 'react';

// --- Utilities & Constants ---
const CUISINES = [
  { id: 'all', name: '全部都殺', icon: '🎲' },
  { id: 'cafe', name: 'Cafe', icon: '☕' },
  { id: 'cha-chaan-teng', name: '港式茶餐廳', icon: '🧋' },
  { id: 'japanese', name: '日本嘢', icon: '🍣' },
  { id: 'thai', name: '泰國菜', icon: '🌶️' },
  { id: 'korean', name: '韓國菜', icon: '🥩' },
  { id: 'burger', name: '漢堡包', icon: '🍔' },
  { id: 'italian', name: '意大利菜', icon: '🍕' },
  { id: 'hotpot', name: '火鍋', icon: '🍲' },
  { id: 'vietnamese', name: '越南粉', icon: '🥢' },
  { id: 'dimsum', name: '點心', icon: '🥟' },
  { id: 'rice', name: '兩餸飯', icon: '🍱' },
  { id: 'fast-food', name: '快餐', icon: '🍟' },
];

const LOCATIONS: Record<string, any[]> = {
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
    title: '搵食盲盒',
    subtitle: '唔知食咩好？一掣幫你決定命運！',
    draw: '撳我抽盲盒！',
    cuisine: '想食咩?',
    distance: '行幾遠?',
    location: '喺邊度食?',
    rating: '最低評分',
    openNow: '營業中',
    favorites: '收藏庫',
    settings: '設定',
    lottery: '抽盲盒',
    reviews: '評論',
    noFavorites: '仲未有收藏喎',
    address: '地址',
    openrice: '睇 OpenRice',
    gmaps: '開 Google Maps',
    any: '全部都殺',
    loading: '搜尋中...',
    share: '分享卡片',
    alternatives: '附近仲有...',
    writeReview: '寫低你嘅評論...',
    submitReview: '提交評論',
    noResults: '附近搵唔到餐廳，試吓較大個距離？',
    searchPlace: '輸入地點（如：旺角）',
    region: '選擇地區',
    suggested: '熱門地點',
    hide: '摺埋選項 ▲',
    showAll: '顯示更多 ▼',
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
    title: 'Food Lottery',
    subtitle: "Don't know what to eat? One click decides your fate!",
    draw: 'Draw Now!',
    cuisine: 'What to eat?',
    distance: 'How far?',
    location: 'Where to eat?',
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
    any: 'Everything',
    loading: 'Searching...',
    share: 'Share Card',
    alternatives: 'Others Nearby...',
    writeReview: 'Write your review...',
    submitReview: 'Submit',
    noResults: 'No restaurants found nearby. Try increasing distance?',
    searchPlace: 'Enter location (e.g. Mong Kok)',
    region: 'Select Region',
    suggested: 'Suggested Locations',
    hide: 'Hide Options ▲',
    showAll: 'Show More ▼',
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

const RestaurantCard = ({ res, isMain = false, favorites = [], onToggleFavorite, onShare, reviews = [], onAddReview, t }: any) => {
  const [newReview, setNewReview] = useState('');
  if (!res || res.error) return null;
  const isFavorite = favorites.some((f: any) => f.name === res.name);
  return (
    <div className={`bg-white border border-slate-200 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-xl ${isMain ? 'shadow-2xl active:scale-[0.99]' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">{res.name}</h3>
          <p className="text-slate-500 text-xs flex items-center gap-2">
            <span className="text-orange-500">📍</span> {res.address}
          </p>
        </div>
        <button 
          onClick={() => onToggleFavorite(res)}
          className="text-2xl p-4 rounded-[1.5rem] bg-slate-50 hover:bg-slate-100 transition-all duration-300 active:scale-75 border border-slate-200"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="flex gap-4 mb-8">
        <div className="bg-green-500/10 text-green-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-200">
          🟢 {t('openNow')}
        </div>
        <div className="bg-amber-500/10 text-amber-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-200">
          ⭐ {res.rating || '4.2'}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <a href={res.openriceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 rounded-2xl text-[10px] font-black transition-all border border-slate-200 uppercase tracking-widest">
          🥡 {t('openrice')}
        </a>
        <a href={res.gmapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 rounded-2xl text-[10px] font-black transition-all border border-slate-200 uppercase tracking-widest">
          🗺️ {t('gmaps')}
        </a>
      </div>
      {isMain && (
        <div className="space-y-6">
          <button 
            onClick={() => onShare(res)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-5 rounded-2xl font-black text-xs transition-all shadow-xl shadow-orange-200 uppercase tracking-[0.2em] active:scale-[0.98]"
          >
            {t('share')}
          </button>
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
              <span>{t('reviews')}</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-500">{(reviews as any[]).filter((r: any) => r.restaurantName === res.name).length}</span>
            </h4>
            <div className="space-y-3 mb-6 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {(reviews as any[]).filter((r: any) => r.restaurantName === res.name).length === 0 ? (
                <div className="text-slate-400 text-[10px] py-4 text-center italic">{t('noReviews')}</div>
              ) : (
                (reviews as any[]).filter((r: any) => r.restaurantName === res.name).map((r: any) => (
                  <div key={r.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-slate-600 text-xs leading-relaxed">{r.content}</p>
                    <span className="text-[8px] text-slate-400 mt-2 block font-bold">{r.date}</span>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newReview} onChange={(e) => setNewReview(e.target.value)} placeholder={t('writeReview')} className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500/50 transition-all focus:ring-4 focus:ring-orange-500/10" />
              <button onClick={() => { if (newReview.trim()) { onAddReview(res.name, newReview); setNewReview(''); } }} className="bg-orange-500 hover:bg-orange-400 text-white w-14 rounded-2xl transition-all shadow-lg active:scale-90 flex items-center justify-center">🚀</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('lottery');
  const [lang, setLang] = useState('zh');
  const [region, setRegion] = useState('hk');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>(() => { try { const saved = localStorage.getItem('favorites'); return saved ? JSON.parse(saved) : []; } catch { return []; } });
  const [userReviews, setUserReviews] = useState<any[]>(() => { try { const saved = localStorage.getItem('userReviews'); return saved ? JSON.parse(saved) : []; } catch { return []; } });
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [distance, setDistance] = useState(1000);
  const [isCuisineExpanded, setIsCuisineExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCoords, setCurrentCoords] = useState<any>(null);
  const [slotText, setSlotText] = useState('');
  
  const t = (key: string) => (TRANSLATIONS[lang] as any)?.[key] || key;
  const slotOptions = useMemo(() => [t('slot1'), t('slot2'), t('slot3'), t('slot4'), t('slot5')], [lang]);
  
  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('userReviews', JSON.stringify(userReviews)); }, [userReviews]);
  
  const handleLottery = async () => {
    setLoading(true);
    setResult(null);
    const interval = setInterval(() => { setSlotText(slotOptions[Math.floor(Math.random() * slotOptions.length)]); }, 200);
    try {
      let lat = 22.3193, lng = 114.1694;
      if (searchQuery) {
        const found = (LOCATIONS[region] as any[]).find((l: any) => l.name === searchQuery);
        if (found) { lat = found.lat; lng = found.lng; }
      }
      const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString(), radius: distance.toString(), category: selectedCuisine, open_now: 'true' });
      const res = await fetch(`/api/lucky-restaurant?${params.toString()}`);
      const data = await res.json();
      setTimeout(() => { clearInterval(interval); setResult(data); setLoading(false); window.scrollTo({ top: 500, behavior: 'smooth' }); }, 1500);
    } catch (err) { clearInterval(interval); setLoading(false); alert(t('searchFailed')); }
  };

  const toggleFavorite = (res: any) => { if (!res || !res.name) return; setFavorites((prev: any[]) => prev.some((f: any) => f.name === res.name) ? prev.filter((f: any) => f.name !== res.name) : [...prev, res]); };
  const shareCard = (res: any) => {
    const text = lang === 'zh' ? `我抽到呢間餐廳：${res.name}！📍 地址：${res.address}。一齊去食？` : `I drew this restaurant: ${res.name}! 📍 Address: ${res.address}. Let's go?`;
    if (navigator.share) { navigator.share({ title: t('title'), text, url: window.location.href }).catch(console.error); } else { navigator.clipboard.writeText(text); alert(t('copied')); }
  };
  const addReview = (restaurantName: string, content: string) => { const review = { id: Date.now(), restaurantName, content, date: new Date().toLocaleDateString() }; setUserReviews((prev: any[]) => [review, ...prev]); };

  const displayedCuisines = isCuisineExpanded ? CUISINES : CUISINES.slice(0, 10);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <header className="bg-orange-500 p-8 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 skew-y-6 transform translate-y-12" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="text-5xl drop-shadow-lg">🎲</div>
          <h1 className="text-4xl font-black text-white tracking-tight">{t('title')}</h1>
          <p className="text-orange-50 text-sm font-bold opacity-90">{t('subtitle')}</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pb-40 -mt-6">
        {activeTab === 'lottery' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 space-y-8">
              {/* Location Section */}
              <section>
                <h3 className="text-lg font-black text-slate-600 mb-6 flex items-center gap-3">📍 {t('location')}</h3>
                <div className="relative mb-4">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlace')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-5 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-all"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(LOCATIONS[region] as any[]).map(l => (
                    <button 
                      key={l.name}
                      onClick={() => setSearchQuery(l.name)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black transition-all border ${searchQuery === l.name ? 'bg-orange-500 text-white border-orange-400' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                    >
                      + {l.name}
                    </button>
                  ))}
                </div>
              </section>

              <div className="h-px bg-slate-100" />

              {/* Cuisine Section */}
              <section>
                <h3 className="text-lg font-black text-slate-600 mb-6 flex items-center gap-3">1. {t('cuisine')}</h3>
                <div className="flex flex-wrap gap-3">
                  {displayedCuisines.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => setSelectedCuisine(c.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-black transition-all duration-300 ${selectedCuisine === c.id ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-200' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                    >
                      <span>{c.icon}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setIsCuisineExpanded(!isCuisineExpanded)} className="w-full mt-8 text-orange-500 text-sm font-black flex items-center justify-center gap-2">{isCuisineExpanded ? t('hide') : t('showAll')}</button>
              </section>

              <div className="h-px bg-slate-100" />

              {/* Distance Section */}
              <section>
                <h3 className="text-lg font-black text-slate-600 mb-6 flex items-center gap-3">2. {t('distance')}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[500, 1000, 2000].map(d => (
                    <button 
                      key={d}
                      onClick={() => setDistance(d)}
                      className={`py-4 rounded-2xl text-xs font-black transition-all border ${distance === d ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-200' : 'bg-slate-50 text-slate-500 border-slate-100'}`}
                    >
                      {d}米內
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <button 
              onClick={handleLottery}
              disabled={loading}
              className={`w-full py-8 rounded-[2.5rem] font-black text-xl transition-all duration-500 shadow-2xl relative overflow-hidden group ${loading ? 'bg-slate-100 text-orange-500' : 'bg-gradient-to-br from-orange-500 via-orange-500 to-red-600 text-white hover:scale-[1.02] active:scale-95'}`}
            >
              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl animate-bounce">🎰</div>
                  <div className="text-[10px] uppercase tracking-[0.2em]">{slotText}</div>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📍</span>
                  <span className="uppercase tracking-widest">{t('draw')}</span>
                </span>
              )}
            </button>

            {result && (
              <div className="animate-in zoom-in-95 fade-in duration-500 pt-10">
                {result.error ? (
                  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 text-center shadow-lg">
                    <div className="text-4xl mb-6">🍽️</div>
                    <p className="text-slate-500 text-sm mb-6">{t('noResults')}</p>
                    <button onClick={() => setDistance(2000)} className="text-orange-500 text-[10px] font-black uppercase tracking-widest">{t('increaseRange')}</button>
                  </div>
                ) : (
                  <>
                    <RestaurantCard res={result} isMain={true} favorites={favorites} onToggleFavorite={toggleFavorite} onShare={shareCard} reviews={userReviews} onAddReview={addReview} t={t} />
                    {result.alternatives && result.alternatives.length > 0 && (
                      <div className="mt-12 space-y-6 pb-10">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-4">🍱 {t('alternatives')}</h3>
                        <div className="space-y-4">
                          {(result.alternatives as any[]).map((alt: any) => (
                            <RestaurantCard key={alt.name} res={alt} favorites={favorites} onToggleFavorite={toggleFavorite} t={t} />
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
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 min-h-[400px]">
            <h2 className="text-3xl font-black text-slate-800 mb-8">{t('favorites')}</h2>
            {favorites.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-medium">🍱 {t('noFavorites')}</div>
            ) : (
              <div className="space-y-4">
                {favorites.map((fav: any) => (
                  <div key={fav.name} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-slate-700">{fav.name}</h3>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">📍 {fav.district || 'HK'}</p>
                    </div>
                    <button onClick={() => toggleFavorite(fav)} className="p-3 bg-white text-orange-500 rounded-2xl border border-slate-100 text-lg">❤️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 min-h-[400px]">
            <h2 className="text-3xl font-black text-slate-800 mb-8">{t('settings')}</h2>
            <div className="space-y-10">
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t('region')}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setRegion('hk')} className={`py-5 rounded-[2rem] text-xs font-black transition-all border ${region === 'hk' ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>Hong Kong 🇭🇰</button>
                  <button onClick={() => setRegion('tw')} className={`py-5 rounded-[2rem] text-xs font-black transition-all border ${region === 'tw' ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>Taiwan 🇹🇼</button>
                </div>
              </section>
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t('langSelect')}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setLang('zh')} className={`py-5 rounded-[2rem] text-xs font-black border ${lang === 'zh' ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>繁體中文</button>
                  <button onClick={() => setLang('en')} className={`py-5 rounded-[2rem] text-xs font-black border ${lang === 'en' ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>English</button>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 flex items-center justify-around h-24 pb-6">
        {[
          { id: 'lottery', icon: '🎲', label: t('lottery') },
          { id: 'favorites', icon: '❤️', label: t('favorites') },
          { id: 'settings', icon: '⚙️', label: t('settings') }
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`relative flex flex-col items-center gap-1.5 px-8 h-full justify-center transition-all ${activeTab === item.id ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}>
            {activeTab === item.id && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-b-full shadow-[0_4px_12px_rgba(59,130,246,0.5)]" />}
            <span className="text-2xl">{item.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
