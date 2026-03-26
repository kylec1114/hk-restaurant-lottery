import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);

  const handleLottery = async () => {
    setLoading(true);
    try {
      if (!navigator.geolocation) {
        alert('你個瀏覽器唤支援定位');
        return;
      }
      
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const response = await fetch(`/api/lucky-restaurant?lat=${latitude}&lng=${longitude}`);
        const data = await response.json();
        setRestaurant(data);
        setLoading(false);
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">🎰 HK Restaurant Lottery</h1>
      <button
        onClick={handleLottery}
        className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg text-xl font-bold"
        disabled={loading}
      >
        {loading ? '抽緊嘅...': '📍 撳我抽盲盒！'}
      </button>
      
      {restaurant && (
        <div className="mt-8 bg-slate-800 p-6 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
          <p className="text-gray-300">{restaurant.address}</p>
          <a
            href={restaurant.openriceUrl}
            target="_blank"
            className="inline-block mt-4 bg-orange-500 px-4 py-2 rounded"
          >
            睦 OpenRice
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
