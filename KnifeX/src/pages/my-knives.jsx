import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TradingBot from '../components/TradingBot';
import ApiClient from '../utils/api';

// Helper function to get the correct image URL from public directory
const getKnifeImageUrl = (itemType, finishName) => {
  console.log('🔍 Looking for:', { itemType, finishName });
  
  // Map item types to their corresponding folder names
  const folderMap = {
    'Butterfly Knife': 'Butterfly Knife',
    'Flip Knife': 'Flip Knife',
    'Gut Knife': 'Gut Knife', 
    'Huntsman Knife': 'Huntsman Knife',
    'Karambit': 'Karambit',
    'Kukri Knife': 'Kukri Knife',
    'M9 Bayonet': 'M9 Knife',  // Database has "M9 Bayonet" but folder is "M9 Knife"
    'Navaja Knife': 'Navaja Knife',
    'Nomad Knife': 'Nomad Knife',
    'Paracord Knife': 'Paracord Knife',
    'Shadow Daggers': 'SD Knife',
    'Skeleton Knife': 'Skeleton Knife',
    'Stiletto Knife': 'Stiletto Knife',
    'Survival Knife': 'Survival Knife',
    'Talon Knife': 'Talon Knife',
    'Ursus Knife': 'Ursus Knife'
  };
  
  // Normalize the knife type for filename prefix
  const normalizeKnifeType = (type) => {
    // Special mappings for knife types that have different prefixes in filenames
    const typeMap = {
      'Butterfly Knife': 'butterfly',
      'Flip Knife': 'flip', 
      'Gut Knife': 'gut',
      'Huntsman Knife': 'huntsman',
      'Karambit': 'karambit',
      'Kukri Knife': 'kukri',
      'M9 Bayonet': 'm9',
      'Navaja Knife': 'navaja',
      'Nomad Knife': 'nomad',
      'Paracord Knife': 'paracord',
      'Shadow Daggers': 'sd',
      'Skeleton Knife': 'skeleton',
      'Stiletto Knife': 'stiletto',
      'Survival Knife': 'survival',
      'Talon Knife': 'talon',
      'Ursus Knife': 'ursus'
    };
    
    return typeMap[type] || type.toLowerCase().replace(/\s+knife$/i, '').replace(/\s+/g, '');
  };
  
  // Normalize finish name for filename
  const normalizeFinishName = (finish) => {
    return finish.toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with hyphens
      .replace(/[™®]/g, '')       // Remove trademark symbols
      .replace(/phase\s*\d+/i, '') // Remove phase numbers from Doppler variants
      .trim();
  };
  
  const folderName = folderMap[itemType] || itemType;
  const normalizedType = normalizeKnifeType(itemType);
  const normalizedFinish = normalizeFinishName(finishName);
  
  // Build the expected filename pattern: type-finish.png
  let expectedFilename = `${normalizedType}-${normalizedFinish}.png`;
  
  // Handle special cases for finish names with capital letters
  if (finishName.toLowerCase() === 'vanilla') {
    expectedFilename = `${normalizedType}-Vanilla.png`; // Vanilla has capital V
  }
  
  console.log('🔎 Expected filename:', expectedFilename);
  console.log('📁 Folder name:', folderName);
  
  // Build the public path using the correct folder name
  const imagePath = `/knives/${encodeURIComponent(folderName)}/${encodeURIComponent(expectedFilename)}`;
  
  console.log('📁 Full image path:', imagePath);
  
  return imagePath;
};

function MyKnives() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [tradingBotOpen, setTradingBotOpen] = useState(false);
  const [selectedKnifeForTrade, setSelectedKnifeForTrade] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyKnives();
    }
  }, [isAuthenticated]);

  const fetchMyKnives = async () => {
    try {
      const data = await ApiClient.getInventory();
      setInventory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Factory New': return 'text-blue-400';
      case 'Minimal Wear': return 'text-green-400';
      case 'Field-Tested': return 'text-yellow-400';
      case 'Well-Worn': return 'text-orange-400';
      case 'Battle-Scarred': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Covert': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'Classified': return 'bg-pink-500/20 border-pink-500/50 text-pink-400';
      case 'Restricted': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'Mil-Spec': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const handleTradeClick = (item) => {
    setSelectedKnifeForTrade(item);
    setTradingBotOpen(true);
  };

  const handleTradeComplete = (tradeResult) => {
    console.log('Trade completed:', tradeResult);
    // Refresh inventory immediately
    fetchMyKnives();
  };

  const closeTradingBot = () => {
    setTradingBotOpen(false);
    setSelectedKnifeForTrade(null);
    // Refresh inventory after trading
    if (isAuthenticated) {
      fetchMyKnives();
    }
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'tradeable') return item.isForTrade;
    if (filter === 'stattrak') return item.knife.statTrak;
    return item.knife.itemType.toLowerCase().includes(filter.toLowerCase());
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 text-xl">Please log in to view your knives.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading your knife collection...</div>
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
          <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            🔪 My Knife Collection
          </h1>
          <p className="text-xl text-gray-300">
            Welcome back, <span className="text-cyan-400 font-bold">{user?.username}</span>! 
            You have <span className="text-yellow-400 font-bold">{inventory.length}</span> knives in your collection.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
            <div className="text-3xl font-bold text-cyan-400">{inventory.length}</div>
            <div className="text-gray-300">Total Knives</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="text-3xl font-bold text-green-400">
              ${inventory.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}
            </div>
            <div className="text-gray-300">Total Value</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="text-3xl font-bold text-purple-400">
              {inventory.filter(item => item.isForTrade).length}
            </div>
            <div className="text-gray-300">Available for Trade</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
            <div className="text-3xl font-bold text-yellow-400">
              {inventory.filter(item => item.knife.statTrak).length}
            </div>
            <div className="text-gray-300">StatTrak™ Knives</div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Knives</option>
            <option value="tradeable">Available for Trade</option>
            <option value="stattrak">StatTrak™ Only</option>
            <option value="butterfly">Butterfly Knife</option>
            <option value="karambit">Karambit</option>
            <option value="m9">M9 Bayonet</option>
            <option value="flip">Flip Knife</option>
            <option value="gut">Gut Knife</option>
            <option value="huntsman">Huntsman Knife</option>
          </select>
        </div>

        {/* Knives Grid */}
        {filteredInventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInventory.map((item) => (
              <div key={item.id} className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transform hover:scale-105 transition-all duration-300">
                {/* Knife Image */}
                <div className="relative overflow-hidden rounded-xl mb-6 bg-gray-800 h-40 flex items-center justify-center">
                  {(() => {
                    const imageUrl = getKnifeImageUrl(item.knife.itemType, item.knife.finishName);
                    
                    return (
                      <>
                        <img 
                          src={imageUrl} 
                          alt={`${item.knife.itemType} | ${item.knife.finishName}`}
                          className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            console.log('❌ Image failed to load:', imageUrl);
                            // Try alternative filename formats if the first one fails
                            const normalizedType = item.knife.itemType.toLowerCase().replace(/\s+knife$/i, '').replace(/\s+/g, '');
                            const normalizedFinish = item.knife.finishName.toLowerCase().replace(/\s+/g, '-').replace(/[™®]/g, '');
                            
                            // Try with lowercase vanilla
                            if (item.knife.finishName.toLowerCase() === 'vanilla') {
                              const altPath = `/knives/${encodeURIComponent(item.knife.itemType)}/${normalizedType}-vanilla.png`;
                              e.target.src = altPath;
                              e.target.onError = () => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              };
                            } else {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div 
                          className="text-gray-500 text-4xl flex-col items-center"
                          style={{ display: 'none' }}
                        >
                          <div className="text-lg font-medium text-gray-400 mb-2">Image not found</div>
                          <div className="text-xs text-center text-gray-600">
                            {item.knife.itemType}<br/>
                            {item.knife.finishName}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                  
                  {/* Rarity Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getRarityColor(item.knife.rarity)}`}>
                      {item.knife.rarity}
                    </span>
                  </div>

                  {/* StatTrak Badge */}
                  {item.knife.statTrak && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-orange-500/80 text-white px-2 py-1 rounded text-xs font-bold">
                        StatTrak™
                      </span>
                    </div>
                  )}

                  {/* Trade Available Badge */}
                  {item.isForTrade && (
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-green-500/80 text-white px-2 py-1 rounded text-xs font-bold">
                        ✓ Tradeable
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Knife Details */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {item.knife.itemType}
                  </h3>
                  <p className="text-gray-400 capitalize">
                    {item.knife.finishName}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                    {item.floatValue && (
                      <span className="text-gray-500 text-sm">
                        Float: {item.floatValue.toFixed(4)}
                      </span>
                    )}
                  </div>

                  {item.price && (
                    <div className="text-2xl font-bold text-green-400">
                      ${item.price.toFixed(2)}
                    </div>
                  )}

                  <div className="text-gray-500 text-sm">
                    Acquired: {new Date(item.acquiredAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg transform hover:scale-105 transition-all duration-300 text-sm">
                    View Details
                  </button>
                  {item.isForTrade && (
                    <button 
                      onClick={() => handleTradeClick(item)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-2 px-4 rounded-lg transform hover:scale-105 transition-all duration-300 text-sm"
                    >
                      Trade
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-gray-400 text-xl">
              {filter === 'all' 
                ? "You don't have any knives yet. Start your collection today!" 
                : "No knives found for the selected filter."}
            </div>
          </div>
        )}
      </div>

      {/* Trading Bot Modal */}
      <TradingBot 
        isOpen={tradingBotOpen}
        onClose={closeTradingBot}
        userKnife={selectedKnifeForTrade}
        onTradeComplete={handleTradeComplete}
      />
    </div>
  );
}

export default MyKnives;
