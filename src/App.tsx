import { useState, useEffect } from 'react';

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
    title: '搵食盲盒',
    draw: '撳我抽盲盒！',
    cuisine: '菜式類型',
    openNow: '營業中',
    favorites: '收藏庫',
    settings: '設定',
    lottery: '抽獎',
    noFavorites: '仲未有收藏喎',
    address: '地址',
    loading: '搜尋中...',
    noResults: '附近搵唔到餐廳，試吓換個地點？',
    searchPlace: '輸入地點（如：旺角）',
    region: '選擇地區',
    suggested: '熱門地點',
  }
};

const logoUrl = \"https://drive.google.com/uc?id=1hzsBQTTjJ1BzyNRjC9GkIE57YQmGNajO\";

export default function App() {
  const [activeTab, setActiveTab] = useState('lottery');
  const [lang] = useState('zh');
  const [region, setRegion] = useState('hk');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [openNow, setOpenNow] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCoords, setCurrentCoords] = useState<any>(null);
  const [slotText, setSlotText] = useState('');

  const slotOptions = ['正在分析您的口味...', '正在查看附近的美味...', '即將揭曉您的盲盒...', '正在挑選特色餐廳...'];

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Geolocation disabled')
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
      let lat = 22.3193, lng = 114.1694;
      if (searchQuery) {
        const found = LOCATIONS[region].find((l: any) => l.name.includes(searchQuery));
        if (found) { lat = found.lat; lng = found.lng; }
      } else if (currentCoords) {
        lat = currentCoords.lat; lng = currentCoords.lng;
      }

      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radius: \"1500\",
        category: selectedCuisine,
        open_now: openNow.toString()
      });

      const res = await fetch(`/api/lucky-restaurant?${params.toString()}`);
      const data = await res.json();
      
      clearInterval(interval);
      setResult(data);
      setLoading(false);
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      alert('搜尋失敗');
    }
  };

  const toggleFavorite = (res: any) => {
    setFavorites((prev: any[]) => 
      prev.some(f => f.name === res.name) 
        ? prev.filter(f => f.name !== res.name) 
        : [...prev, res]
    );
  };

  return (
    <div className=\"min-h-screen bg-[#0a0a0c] text-slate-200 font-sans pb-32\">
      <div className=\"fixed inset-0 overflow-hidden pointer-events-none\">
        <div className=\"absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full\" />
        <div className=\"absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full\" />
      </div>

      <div className=\"max-w-md mx-auto px-6 pt-12 relative z-10\">
        <header className=\"flex flex-col items-center mb-10\">
          <div className=\"relative mb-4\">
             <div className=\"absolute inset-0 bg-blue-500 blur-2xl opacity-20\" />
             <img src={logoUrl} alt=\"Logo\" className=\"w-16 h-16 rounded-2xl relative border border-white/10 shadow-2xl\" />
          </div>
          <h1 className=\"text-2xl font-black text-white mb-1\">{t('title')}</h1>
          <span className=\"text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]\">HK Restaurant Lottery</span>
        </header>

        {activeTab === 'lottery' && (
          <div className=\"space-y-8\">
            <div className=\"relative\">
              <input 
                type=\"text\" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlace')}
                className=\"w-full bg-slate-900/40 border border-white/5 rounded-2xl px-6 py-5 text-sm backdrop-blur-xl focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600\"
              />
              <span className=\"absolute left-6 top-[-10px] bg-[#0a0a0c] px-2 text-[9px] font-black text-blue-500 uppercase tracking-widest\">Location</span>
            </div>

            <section>
              <h3 className=\"text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4\">{t('cuisine')}</h3>
              <div className=\"grid grid-cols-4 gap-3\">
                {CUISINES.slice(0, 8).map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCuisine(c.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                      selectedCuisine === c.id 
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/20' 
                        : 'bg-slate-900/40 border-white/5 text-slate-500 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className=\"text-lg\">{c.icon}</span>
                    <span className=\"text-[9px] font-bold truncate w-full text-center\">{c.name}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className=\"flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 backdrop-blur-md\">
              <div className=\"flex items-center gap-3\">
                <span className=\"text-xs\">🕒</span>
                <span className=\"text-[11px] font-bold text-slate-300 uppercase tracking-widest\">{t('openNow')}</span>
              </div>
              <button 
                onClick={() => setOpenNow(!openNow)}
                className={`w-12 h-6 rounded-full transition-all relative ${openNow ? 'bg-green-600' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${openNow ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <button
              onClick={handleLottery}
              disabled={loading}
              className=\"w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-6 rounded-3xl font-black text-sm text-white uppercase tracking-[0.2em] shadow-2xl active:scale-[0.97] disabled:opacity-50 border border-white/10\"
            >
              {loading ? slotText : t('draw')}
            </button>

            {result && !result.error && (
              <div className=\"bg-slate-900/60 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl shadow-2xl\">
                <div className=\"flex justify-between items-start mb-6\">
                  <span className=\"bg-blue-500/10 text-blue-400 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest\">Found for you</span>
                  <button onClick={() => toggleFavorite(result)} className=\"text-2xl\">
                    {favorites.some((f:any) => f.name === result.name) ? '❤️' : '🤍'}
                  </button>
                </div>
                <h2 className=\"text-2xl font-black text-white mb-2\">{result.name}</h2>
                <p className=\"text-slate-400 text-xs mb-6 flex items-start gap-2\">
                  <span>📍</span> {result.address}
                </p>
                <div className=\"flex gap-3\">
                  <a href={result.gmapsUrl} target=\"_blank\" className=\"flex-1 bg-white/5 py-4 rounded-2xl text-[10px] font-black text-center uppercase border border-white/5\">Google Maps</a>
                  <a href={result.openriceUrl} target=\"_blank\" className=\"flex-1 bg-white/5 py-4 rounded-2xl text-[10px] font-black text-center uppercase border border-white/5\">OpenRice</a>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 className=\"text-xl font-black text-white mb-8\">{t('favorites')}</h2>
            {favorites.length === 0 ? (
              <div className=\"text-center py-20 opacity-30 italic text-sm\">{t('noFavorites')}</div>
            ) : (
              <div className=\"space-y-4\">
                {favorites.map((fav: any) => (
                  <div key={fav.name} className=\"bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between\">
                    <div>
                      <h4 className=\"font-bold text-sm text-white\">{fav.name}</h4>
                      <p className=\"text-[10px] text-slate-500\">{fav.address}</p>
                    </div>
                    <button onClick={() => toggleFavorite(fav)} className=\"text-xl\">❤️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
             <h2 className=\"text-xl font-black text-white mb-8\">{t('settings')}</h2>
             <div className=\"space-y-6\">
               <div>
                 <h4 className=\"text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4\">Region</h4>
                 <div className=\"grid grid-cols-2 gap-3\">
                   <button onClick={() => setRegion('hk')} className={`py-4 rounded-2xl text-xs font-black transition-all ${region === 'hk' ? 'bg-blue-600 text-white' : 'bg-slate-900/40 text-slate-500'}`}>HK 🇭🇰</button>
                   <button onClick={() => setRegion('tw')} className={`py-4 rounded-2xl text-xs font-black transition-all ${region === 'tw' ? 'bg-blue-600 text-white' : 'bg-slate-900/40 text-slate-500'}`}>TW 🇹🇼</button>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>

      <nav className=\"fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/60 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-3 shadow-2xl z-50 flex items-center justify-around\">
        {[
          { id: 'lottery', icon: '🎰', label: t('lottery') },
          { id: 'favorites', icon: '❤️', label: t('favorites') },
          { id: 'settings', icon: '⚙️', label: t('settings') }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-3xl transition-all ${
              activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className=\"text-lg\">{item.icon}</span>
            <span className=\"text-[9px] font-black uppercase tracking-widest\">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
