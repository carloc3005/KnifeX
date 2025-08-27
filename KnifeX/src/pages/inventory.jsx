import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ApiClient from '../utils/api';

const Inventory = () => {
  const { user, isAuthenticated } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInventory();
    }
  }, [isAuthenticated]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const inventoryData = await ApiClient.getInventory();
      setInventory(inventoryData);
    } catch (err) {
      setError('Failed to load inventory');
      console.error('Inventory fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : 'No price';
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Factory New': return 'text-green-400';
      case 'Minimal Wear': return 'text-blue-400';
      case 'Field-Tested': return 'text-yellow-400';
      case 'Well-Worn': return 'text-orange-400';
      case 'Battle-Scarred': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">My Inventory</h1>
          <p className="text-gray-400 text-xl">Please log in to view your inventory.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">My Inventory</h1>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading your inventory...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">My Inventory</h1>
          <p className="text-red-400 text-xl">{error}</p>
          <button 
            onClick={fetchInventory}
            className="mt-4 bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">My Inventory</h1>
          <p className="text-gray-400 text-xl">Welcome back, {user?.username}!</p>
          <p className="text-gray-500 mt-2">{inventory.length} knives in your collection</p>
        </header>

        {inventory.length === 0 ? (
          <div className="text-center">
            <div className="bg-gray-800 rounded-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎒</div>
              <h2 className="text-2xl font-bold mb-4">Your inventory is empty</h2>
              <p className="text-gray-400 mb-6">
                Start building your collection by acquiring knives from cases or trades.
              </p>
              <button className="bg-sky-600 hover:bg-sky-700 px-6 py-3 rounded-lg font-semibold">
                Explore Knives
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inventory.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="p-4 text-center bg-gray-750">
                  <h3 className="text-sm text-gray-400">{item.knife.itemType}</h3>
                  <h2 className="text-lg font-bold">{item.knife.finishName}</h2>
                  
                  {/* Quality and StatTrak badges */}
                  <div className="mt-2 space-y-1">
                    <div className="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                      {item.knife.quality}
                    </div>
                    {item.knife.statTrak && (
                      <div className="block">
                        <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                          StatTrak™
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Condition */}
                  <div className="mt-2">
                    <span className={`text-sm font-semibold ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                    {item.floatValue && (
                      <div className="text-xs text-gray-500 mt-1">
                        Float: {item.floatValue.toFixed(6)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Knife Image */}
                <div className="bg-gray-700 p-4">
                  <img 
                    src={item.knife.imageUrl} 
                    alt={`${item.knife.itemType} ${item.knife.finishName}`} 
                    className="w-full h-32 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Price and Actions */}
                <div className="p-4">
                  <div className="text-center mb-3">
                    <span className="text-xl font-bold text-green-400">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      className={`w-full py-2 px-3 rounded text-sm font-semibold transition-colors ${
                        item.isForTrade 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      {item.isForTrade ? 'Listed for Trade' : 'List for Trade'}
                    </button>
                    
                    <button className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded text-sm font-semibold transition-colors">
                      View Details
                    </button>
                  </div>

                  {/* Acquisition date */}
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Acquired: {new Date(item.acquiredAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
