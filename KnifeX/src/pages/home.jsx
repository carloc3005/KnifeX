import React from "react";
import bannerImage from "../assets/images/cs-banner.png";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
            <img src = {bannerImage} alt="Banner" className="w-full max-w-6xl h-80 object-cover mt-4 mb-8"/>
            <h1 className="text-5xl font-bold mb-4">Welcome to KnifeX</h1>
            
        </div>
    );
}