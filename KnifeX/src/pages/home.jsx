import React from "react";
import bannerImage from "../assets/images/cs-banner.png";
import Roulette from "../components/Roulette"; // Import the Roulette component

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-800 text-white">
            <img src = {bannerImage} alt="Banner" className="w-full max-w-6xl h-80 object-cover mt-4 mb-8"/>
            <h1 className="text-5xl font-bold mb-4">Play and Win!!!!!</h1>
            {/* Roulette Game Section */}
            <Roulette />
            <h1 className="text-5xl font-bold mb-4">Welcome to KnifeX</h1>
            
        </div>
    );
}