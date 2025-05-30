import React, { useState, useEffect } from "react";
import bannerImage from "../assets/images/cs-banner.png";
import Roulette from "../components/Roulette"; // Import the Roulette component

// Use import.meta.glob to get all knife images.
// This Vite feature will find all .png files in the specified path
// and provide their URLs.
const knifeImageModules = import.meta.glob('../assets/knives/*/*.png', { eager: true, as: 'url' });

// Function to get the knife name from the path
const getKnifeName = (path) => {
  const parts = path.split('/');
  const fileName = parts[parts.length - 1];
  // Remove extension (png, jpg, jpeg) and replace hyphens with spaces for a cleaner name
  return fileName.replace(/\.(png|jpg|jpeg)$/i, '').replace(/-/g, ' ').replace(/_/g, ' ');
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
        const allKnivesData = imageFilePaths.map(path => ({
            src: knifeImageModules[path], // The URL of the image
            name: getKnifeName(path)      // The display name derived from the file path
        }));

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
                    {featuredKnives.map((knife, index) => (
                        <div key={index} 
                             className="group bg-gray-800 p-5 rounded-lg shadow-xl hover:shadow-purple-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-2 flex flex-col items-center text-center">
                            <img 
                                src={knife.src} 
                                alt={knife.name} 
                                className="w-full h-56 object-contain mb-4 rounded-md transition-transform duration-300 group-hover:scale-110"
                            />
                            <h3 className="text-2xl font-semibold text-white capitalize mb-2 group-hover:text-purple-400 transition-colors duration-300">{knife.name}</h3>
                            {/* You could add more details here, like rarity or price, if available */}
                        </div>
                    ))}
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