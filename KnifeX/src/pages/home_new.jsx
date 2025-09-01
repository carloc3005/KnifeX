import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bannerImage from '../assets/images/cs-banner.png';
import Roulette from '../components/Roulette';

// Use import.meta.glob to get all knife images
const knifeImageModules = import.meta.glob('../assets/knives/*/*.png', { eager: true, query: '?url', import: 'default' });

// Function to get knife name and type from path
const getKnifeNameAndType = (path) => {
  const parts = path.split('/');
  const fileName = parts[parts.length - 1];
  const typeFolder = parts[parts.length - 2];

  // Extract finish name from lowercase filename (remove prefix and extension)
  const fileNameWithoutExt = fileName.replace(/\.(png|jpg|jpeg)$/i, '');
  const prefix = typeFolder.toLowerCase().replace(/\s+/g, '');
  const finishName = fileNameWithoutExt
    .replace(new RegExp(`^${prefix}-`, 'i'), '') // Remove prefix (e.g., "gut-")
    .replace(/-/g, ' ') // Replace dashes with spaces
    .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word

  let itemType = typeFolder.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  if (itemType === 'M9 Knife') itemType = 'M9 Bayonet';
  if (itemType === 'Sd Knife') itemType = 'Shadow Daggers';

  return { finishName, itemType };
};

function Home() {
  const [featuredKnives, setFeaturedKnives] = useState([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const imageFilePaths = Object.keys(knifeImageModules);

    const shuffleArray = (array) => {
      let currentIndex = array.length, randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]
        ];
      }
      return array;
    };

    const allKnivesData = imageFilePaths.map((path, index) => {
      const { finishName, itemType } = getKnifeNameAndType(path);
      const priceHigh = +(Math.random() * 3900 + 100).toFixed(2);
      const priceLow = +(priceHigh * (Math.random() * 0.6 + 0.4)).toFixed(2);
      return {
        id: index + 1,
        src: knifeImageModules[path],
        finishName,
        itemType,
        priceHigh,
        priceLow,
        rarity: ['Covert', 'Classified', 'Restricted', 'Mil-Spec'][Math.floor(Math.random() * 4)]
      };
    });

    const shuffledKnives = shuffleArray([...allKnivesData]);
    setFeaturedKnives(shuffledKnives.slice(0, 6));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="w-full min-h-screen bg-cover bg-center relative"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-purple-900/70"></div>
          <div className="relative z-10 flex items-center justify-center min-h-screen text-center px-4">
            <div className="max-w-6xl">
              <div className="animate-pulse mb-8">
                <span className="text-2xl text-yellow-400 font-bold">⚡ LIVE NOW</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-extrabold text-white mb-8 leading-tight">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse">
                  KnifeX
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-200 mb-12 leading-relaxed max-w-4xl mx-auto">
                The ultimate destination for CS2 knife trading. Discover rare skins, secure trades, and build your dream collection.
              </p>
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/my-knives"
                      className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-5 px-12 rounded-2xl text-xl shadow-2xl transform hover:scale-110 transition-all duration-300 ease-in-out"
                    >
                      <span className="flex items-center">
                        🎒 View My Inventory
                        <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Link>
                    <Link 
                      to="/knives"
                      className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-bold py-5 px-12 rounded-2xl text-xl shadow-2xl transform hover:scale-110 transition-all duration-300 ease-in-out"
                    >
                      <span className="flex items-center">
                        🔪 Browse Knives
                        <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/signup"
                      className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-5 px-12 rounded-2xl text-xl shadow-2xl transform hover:scale-110 transition-all duration-300 ease-in-out"
                    >
                      <span className="flex items-center">
                        🚀 Start Trading Now
                        <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Link>
                    <Link 
                      to="/login"
                      className="group bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-5 px-12 rounded-2xl text-xl shadow-2xl transform hover:scale-110 transition-all duration-300 ease-in-out border-2 border-gray-500 hover:border-gray-400"
                    >
                      <span className="flex items-center">
                        🔑 Sign In
                        <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                        </svg>
                      </span>
                    </Link>
                  </>
                )}
              </div>
              
              {/* Live Stats */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
                  <div className="text-3xl font-bold text-cyan-400">15,247</div>
                  <div className="text-gray-300">Active Traders</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                  <div className="text-3xl font-bold text-purple-400">$2.4M</div>
                  <div className="text-gray-300">Daily Volume</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
                  <div className="text-3xl font-bold text-pink-400">99.8%</div>
                  <div className="text-gray-300">Trade Success</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Knife Roulette Section */}
      <section className="py-24 bg-gradient-to-r from-gray-800/50 to-purple-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
              🎰 Knife Roulette
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Try your luck with our exciting knife roulette! Win rare and valuable CS2 knife skins.
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-yellow-500/30">
            <Roulette />
          </div>
        </div>
      </section>

      {/* Featured Knives Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              🔥 Featured Knives
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
              Discover the most sought-after knife skins in our marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredKnives.map((knife) => (
              <div key={knife.id} className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transform hover:scale-105 transition-all duration-300">
                <div className="relative overflow-hidden rounded-xl mb-6 bg-gray-800">
                  <img 
                    src={knife.src} 
                    alt={`${knife.itemType} | ${knife.finishName}`}
                    className="w-full h-48 object-contain transform group-hover:scale-110 transition-transform duration-300 knife-icon"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      knife.rarity === 'Covert' ? 'bg-red-500/80 text-white' :
                      knife.rarity === 'Classified' ? 'bg-pink-500/80 text-white' :
                      knife.rarity === 'Restricted' ? 'bg-purple-500/80 text-white' :
                      'bg-blue-500/80 text-white'
                    }`}>
                      {knife.rarity}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {knife.itemType}
                </h3>
                <p className="text-gray-400 mb-4 capitalize">
                  {knife.finishName}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      ${knife.priceHigh}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      ${knife.priceLow}
                    </p>
                  </div>
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg transform hover:scale-105 transition-all duration-300">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link 
              to="/knives"
              className="group inline-flex items-center bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <span>🗂️ Explore All Knives</span>
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-r from-gray-800/30 to-purple-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              🚀 How KnifeX Works
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of traders in the most secure and user-friendly CS2 knife marketplace
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm rounded-3xl p-10 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300 group-hover:scale-105">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">1. Create Account</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Sign up for free and verify your account. Connect your Steam profile to get started with secure trading.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-10 border border-purple-500/30 group-hover:border-purple-400/60 transition-all duration-300 group-hover:scale-105">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🔄</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">2. Browse & Trade</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Explore our vast collection of knife skins. Make offers, negotiate prices, and execute secure trades.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-3xl p-10 border border-green-500/30 group-hover:border-green-400/60 transition-all duration-300 group-hover:scale-105">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">3. Secure Transfer</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Complete your trades with confidence using our escrow system. Your items are protected throughout the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
