import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function TradingBot({ isOpen, onClose, userKnife, onTradeComplete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableKnives, setAvailableKnives] = useState([]);
  const [filteredKnives, setFilteredKnives] = useState([]);
  const [selectedBotKnife, setSelectedBotKnife] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tradeStatus, setTradeStatus] = useState(''); // 'pending', 'accepted', 'declined'
  const { user } = useAuth();

  // Bot's available knives for trade
  const botInventory = [
    {
      id: 'bot_1',
      itemType: 'Karambit',
      finishName: 'Doppler',
      condition: 'Factory New',
      statTrak: false,
      price: 850.50,
      rarity: 'Covert',
      imageUrl: '/src/assets/knives/Karambit/karambit-doppler.png',
      floatValue: 0.02
    },
    {
      id: 'bot_2', 
      itemType: 'M9 Bayonet',
      finishName: 'Fade',
      condition: 'Factory New',
      statTrak: false,
      price: 650.00,
      rarity: 'Covert',
      imageUrl: '/src/assets/knives/M9 Knife/m9-fade.png',
      floatValue: 0.01
    },
    {
      id: 'bot_3',
      itemType: 'Flip Knife',
      finishName: 'Tiger Tooth',
      condition: 'Minimal Wear',
      statTrak: true,
      price: 320.75,
      rarity: 'Covert',
      imageUrl: '/src/assets/knives/Flip Knife/flip-tiger-tooth.png',
      floatValue: 0.08
    },
    {
      id: 'bot_4',
      itemType: 'Huntsman Knife',
      finishName: 'Crimson Web',
      condition: 'Field-Tested',
      statTrak: false,
      price: 275.00,
      rarity: 'Covert',
      imageUrl: '/src/assets/knives/Huntsman Knife/huntsman-crimson-web.png',
      floatValue: 0.22
    },
    {
      id: 'bot_5',
      itemType: 'Gut Knife',
      finishName: 'Marble Fade',
      condition: 'Factory New',
      statTrak: false,
      price: 165.25,
      rarity: 'Covert',
      imageUrl: '/src/assets/knives/Gut Knife/gut-marble-fade.png',
      floatValue: 0.03
    },
    {
      id: 'bot_6',
      itemType: 'Karambit',
      finishName: 'Autotronic',
      condition: 'Minimal Wear',
      statTrak: true,
      price: 1150.00,
      rarity: 'Covert',
      imageUrl: '/src/assets/knives/Karambit/karambit-autotronic.png',
      floatValue: 0.07
    }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchBotInventory();
      setSearchTerm('');
      setSelectedBotKnife(null);
      setTradeStatus('');
    }
  }, [isOpen]);

  const fetchBotInventory = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/bot/inventory');
      const data = await response.json();
      setAvailableKnives(data);
      setFilteredKnives(data);
    } catch (error) {
      console.error('Error fetching bot inventory:', error);
      // Fallback to hardcoded inventory if API fails
      setAvailableKnives(botInventory);
      setFilteredKnives(botInventory);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = availableKnives.filter(knife => 
        knife.itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        knife.finishName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredKnives(filtered);
    } else {
      setFilteredKnives(availableKnives);
    }
  }, [searchTerm, availableKnives]);

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

  const calculateTradeValue = () => {
    if (!userKnife || !selectedBotKnife) return { userValue: 0, botValue: 0, difference: 0 };
    
    const userValue = userKnife.price || 0;
    const botValue = selectedBotKnife.price || 0;
    const difference = botValue - userValue;
    
    return { userValue, botValue, difference };
  };

  const handleTrade = async () => {
    if (!selectedBotKnife || !userKnife) return;
    
    setLoading(true);
    setTradeStatus('pending');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/bot/trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userInventoryId: userKnife.id,
          botKnifeId: selectedBotKnife.id
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setTradeStatus('accepted');
        // Notify parent component of successful trade
        if (onTradeComplete) {
          onTradeComplete(result);
        }
      } else {
        setTradeStatus('declined');
      }
    } catch (error) {
      console.error('Trade error:', error);
      setTradeStatus('declined');
    } finally {
      setLoading(false);
    }
  };

  const resetTrade = () => {
    setSelectedBotKnife(null);
    setTradeStatus('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              🤖 Trading Bot
            </h2>
            <p className="text-gray-300 mt-2">Find the perfect knife to trade with our AI bot</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Trade Status */}
        {tradeStatus && (
          <div className={`mb-6 p-4 rounded-xl text-center ${
            tradeStatus === 'accepted' ? 'bg-green-500/20 border border-green-500/50' :
            tradeStatus === 'declined' ? 'bg-red-500/20 border border-red-500/50' :
            'bg-yellow-500/20 border border-yellow-500/50'
          }`}>
            {tradeStatus === 'pending' && (
              <div className="text-yellow-400">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full mr-2"></div>
                Bot is considering your trade offer...
              </div>
            )}
            {tradeStatus === 'accepted' && (
              <div className="text-green-400">
                ✅ Trade accepted! Your knives have been exchanged.
              </div>
            )}
            {tradeStatus === 'declined' && (
              <div className="text-red-400">
                ❌ Trade declined. The bot thinks this trade isn't fair.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Knife */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Your Knife</h3>
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <div className="relative overflow-hidden rounded-xl mb-4 bg-gray-800 h-32 flex items-center justify-center">
                {userKnife?.knife?.imageUrl ? (
                  <img 
                    src={userKnife.knife.imageUrl} 
                    alt={`${userKnife.knife.itemType} | ${userKnife.knife.finishName}`}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-500 text-4xl">🔪</div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getRarityColor(userKnife?.knife?.rarity)}`}>
                    {userKnife?.knife?.rarity}
                  </span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-white">{userKnife?.knife?.itemType}</h4>
              <p className="text-gray-400">{userKnife?.knife?.finishName}</p>
              <p className={getConditionColor(userKnife?.condition)}>{userKnife?.condition}</p>
              <p className="text-green-400 text-lg font-bold">${userKnife?.price?.toFixed(2)}</p>
            </div>
          </div>

          {/* Bot's Knives */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Bot's Inventory</h3>
            
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search knives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Available Knives */}
            <div className="max-h-96 overflow-y-auto space-y-3">
              {filteredKnives.map((knife) => (
                <div 
                  key={knife.id}
                  className={`bg-gray-800/50 rounded-xl p-4 border cursor-pointer transition-all ${
                    selectedBotKnife?.id === knife.id 
                      ? 'border-cyan-500 bg-cyan-500/10' 
                      : 'border-gray-700/50 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedBotKnife(knife)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-gray-500 text-2xl">🔪</div>
                      {knife.statTrak && (
                        <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 rounded">ST</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-bold">{knife.itemType}</h5>
                      <p className="text-gray-400 text-sm">{knife.finishName}</p>
                      <p className={`text-sm ${getConditionColor(knife.condition)}`}>{knife.condition}</p>
                      <p className="text-green-400 font-bold">${knife.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Summary */}
        {selectedBotKnife && (
          <div className="mt-8 bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Trade Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="text-center">
                <div className="text-gray-400">You Give</div>
                <div className="text-2xl font-bold text-red-400">
                  ${calculateTradeValue().userValue.toFixed(2)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-2">⇄</div>
                <div className={`text-lg font-bold ${
                  calculateTradeValue().difference > 0 ? 'text-green-400' : 
                  calculateTradeValue().difference < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {calculateTradeValue().difference > 0 ? '+' : ''}
                  ${calculateTradeValue().difference.toFixed(2)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-gray-400">You Get</div>
                <div className="text-2xl font-bold text-green-400">
                  ${calculateTradeValue().botValue.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          {!tradeStatus ? (
            <>
              <button 
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleTrade}
                disabled={!selectedBotKnife || loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Propose Trade'}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={resetTrade}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
              >
                Try Another Trade
              </button>
              <button 
                onClick={onClose}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TradingBot;
