import React, { useState, useEffect } from 'react';

function KnifePrices() {
  const [prices, setPrices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchKnifePrices();
    fetchMarketStats();
  }, []);

  const fetchKnifePrices = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/knife-prices');
      if (!response.ok) throw new Error('Failed to fetch prices');
      const data = await response.json();
      setPrices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/knife-prices/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const filteredPrices = prices.filter(price => {
    if (filter === 'all') return true;
    return price.itemType.toLowerCase().includes(filter.toLowerCase());
  });

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'RISING': return '📈';
      case 'FALLING': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'RISING': return 'text-green-400';
      case 'FALLING': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading knife prices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-red-400 text-2xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            💰 Knife Market Prices
          </h1>
          <p className="text-xl text-gray-300">Real-time CS2 knife prices and market data</p>
        </div>

        {/* Market Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
              <div className="text-3xl font-bold text-cyan-400">{stats.totalKnives}</div>
              <div className="text-gray-300">Total Knives</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
              <div className="text-3xl font-bold text-green-400">${stats.averagePrice?.toFixed(2)}</div>
              <div className="text-gray-300">Average Price</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <div className="text-3xl font-bold text-purple-400">${stats.maxPrice?.toFixed(2)}</div>
              <div className="text-gray-300">Highest Price</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
              <div className="text-3xl font-bold text-yellow-400">{stats.trendingUp}</div>
              <div className="text-gray-300">Trending Up</div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-8">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Knives</option>
            <option value="karambit">Karambit</option>
            <option value="m9">M9 Bayonet</option>
            <option value="flip">Flip Knife</option>
            <option value="gut">Gut Knife</option>
            <option value="huntsman">Huntsman Knife</option>
          </select>
        </div>

        {/* Prices Table */}
        <div className="bg-black/40 backdrop-blur-lg rounded-3xl overflow-hidden border border-gray-700/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Knife</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Finish</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Condition</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">StatTrak</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Trend</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Volume</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrices.map((price) => (
                  <tr key={price.id} className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{price.itemType}</td>
                    <td className="px-6 py-4 text-gray-300">{price.finishName}</td>
                    <td className="px-6 py-4 text-gray-300">{price.condition}</td>
                    <td className="px-6 py-4">
                      {price.statTrak ? (
                        <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-sm">
                          StatTrak™
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-green-400 font-bold text-lg">
                        ${price.currentPrice.toFixed(2)}
                      </div>
                      {price.lowPrice && price.highPrice && (
                        <div className="text-gray-500 text-sm">
                          ${price.lowPrice.toFixed(2)} - ${price.highPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center ${getTrendColor(price.trend)}`}>
                        {getTrendIcon(price.trend)} {price.trend}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{price.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPrices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl">No knives found for the selected filter.</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KnifePrices;
