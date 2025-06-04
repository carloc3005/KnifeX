import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import bannerImage from "../assets/images/cs-banner.png";
import Roulette from "../components/Roulette"; // Import the Roulette component

// Use import.meta.glob to get all knife images.
// This Vite feature will find all .png files in the specified path
// and provide their URLs.
const knifeImageModules = import.meta.glob('../assets/knives/*/*.png', { eager: true, as: 'url' });

// Function to get the knife name from the path
const getKnifeNameAndType = (path) => {
  const parts = path.split('/');
  const fileName = parts[parts.length - 1];
  const typeFolder = parts[parts.length - 2];

  // Remove extension (png, jpg, jpeg) and replace hyphens with spaces for a cleaner name
  const finishName = fileName.replace(/\.(png|jpg|jpeg)$/i, '').replace(/-/g, ' ').replace(/_/g, ' ');
  let itemType = typeFolder.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  if (itemType === 'M9 Knife') itemType = 'M9 Bayonet';
  if (itemType === 'Sd Knife') itemType = 'Shadow Daggers';

  return { finishName, itemType }; 
};


export default function Home() {
    const [featuredKnives, setFeaturedKnives] = useState([]);

    useEffect(() => {
        // Get the original file paths (keys of the module object)
        const imageFilePaths = Object.keys(knifeImageModules);

        const shuffleArray = (array) => {
            let currentIndex = array.length, randomIndex;
            // While there remain elements to shuffle.
            while (currentIndex !== 0) {
                // Pick a remaining element.
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
            }
            return array;
        };

        // Create an array of knife objects, each with its src URL and name
        const allKnivesData = imageFilePaths.map((path, index) => {
            const { finishName, itemType } = getKnifeNameAndType(path);
            const priceHigh = +(Math.random()*3900 + 100).toFixed(2);
            const priceLow  = +(priceHigh * (Math.random()*0.6 + 0.4)).toFixed(2);
            return {
                id: index + 1, // Simple ID generation
                src: knifeImageModules[path], 
                finishName,
                itemType,
                quality: ['Covert Knife','Classified Knife','Restricted Knife','Mil‑Spec Grade Knife'][Math.floor(Math.random()*4)],
                statTrak: Math.random() > 0.6 ? 'StatTrak Available' : null,
                priceHigh,
                priceLow,
                // For simplicity, using a generic source and market offers for featured knives
                source: 'Featured Collection',
                marketOffers: `${Math.floor(Math.random()*1800)+50} offers on ${Math.floor(Math.random()*20)+5} markets`
            };
        });

        // Shuffle the array and pick the first 3 knives
        const selectedKnives = shuffleArray([...allKnivesData]).slice(0, 3);
        setFeaturedKnives(selectedKnives);
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-800 text-white">
            {/* Roulette Game Section */}
            <Roulette />
            {/* Banner with Catchy Text */}
            <div 
                className="w-full max-w-7xl h-80 object-cover mt-4 mb-8 flex items-center justify-center text-center relative mx-auto"
                style={{ backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 bg-black opacity-40"></div> {/* Optional: Dark overlay for better text visibility */}
                <h1 className="text-6xl font-bold text-white z-10 drop-shadow-lg">Unlock Your Arsenal!</h1>
            </div>

            {/* Knife Feature Section */}
            <section className="w-full max-w-7xl mx-auto my-12 p-8 bg-gray-900 rounded-xl shadow-2xl">
                <h2 className="text-5xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Featured Knives</h2>
                <p className="text-xl text-gray-300 mb-10 text-center">
                    Discover our rarest and most sought-after knife skins, updated daily!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredKnives.map((knife) => (
                        <div key={knife.id} className="bg-gray-800 rounded-lg shadow-xl flex flex-col">
                            <div className="p-4 text-center">
                                <h3 className="text-sm text-gray-400">{knife.itemType}</h3>
                                <h2 className="text-lg font-bold">{knife.finishName}</h2>
                                <div className="mt-2 inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                                    {knife.quality}
                                </div>
                                {knife.statTrak && (
                                    <div className="mt-1 inline-block bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                                        {knife.statTrak}
                                    </div>
                                )}
                            </div>
                            <img 
                                src={knife.src} 
                                alt={`${knife.itemType} ${knife.finishName}`} 
                                className="w-full h-56 object-contain"
                            />
                            <div className="p-4 mt-auto text-center">
                                <p className="font-bold">${knife.priceLow} – ${knife.priceHigh}</p>
                                <p className="text-xs text-gray-500 truncate">{knife.source}</p>
                            </div>
                            <div className="bg-gray-700 p-2 text-center text-xs text-sky-400 font-semibold">
                                {knife.marketOffers}
                            </div>
                        </div>
                    ))}
                </div>
                 {/* Button to explore all knives */}
                <div className="text-center mt-12">
                    <Link 
                        to="/knives"
                        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-10 rounded-lg text-lg shadow-lg transform hover:scale-105 transition duration-150 ease-in-out"
                    >
                        Explore All Knives
                    </Link>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="w-full max-w-7xl mx-auto my-12 p-8 bg-gray-900 rounded-xl shadow-2xl">
                <h2 className="text-5xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">How KnifeX Works</h2>
                <div className="grid md:grid-cols-2 gap-8 text-lg">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-3xl font-semibold mb-4 text-sky-400">Trade Your Knives</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Got a knife you're looking to swap? Browse our extensive inventory and find the perfect match. Our secure trading system makes it easy to exchange your current knife for a new one from our collection. 
                        </p>
                        <p className="text-gray-300 leading-relaxed mt-2">
                            Simply select the knife you want, offer yours in exchange, and complete the trade seamlessly.
                        </p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-3xl font-semibold mb-4 text-sky-400">List Your Knives</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Want to sell your knife to other enthusiasts? List it on KnifeX! Set your price, provide details, and reach a wide audience of potential buyers. 
                        </p>
                        <p className="text-gray-300 leading-relaxed mt-2">
                            Our platform provides a safe and reliable marketplace for you to showcase and sell your CS2 knife skins.
                        </p>
                    </div>
                </div>
                <div className="text-center mt-12">
                    <Link 
                        to="/knives" // Or a dedicated page for getting started, e.g., /get-started
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-10 rounded-lg text-lg shadow-lg transform hover:scale-105 transition duration-150 ease-in-out"
                    >
                        Get Started Now
                    </Link>
                </div>
            </section>

            {/* Promotional Offer Section */}
            <section className="w-full max-w-7xl mx-auto my-10 p-8 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl shadow-2xl text-center">
                <h2 className="text-4xl font-extrabold mb-3 text-white drop-shadow-md">🔥 Special Launch Offer! 🔥</h2>
                <p className="text-xl text-gray-100 mb-6">
                    For a limited time, get <span className="font-bold text-yellow-300">25% EXTRA credits</span> on your first case opening! Start your journey with a bang!
                </p>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-10 rounded-lg text-lg shadow-lg transform hover:scale-105 transition duration-150 ease-in-out">
                    Claim Bonus Now!
                </button>
            </section>

            <h1 className="text-5xl font-bold mb-4 w-full max-w-7xl mx-auto text-center">Welcome to KnifeX</h1>
            
        </div>
    );
}