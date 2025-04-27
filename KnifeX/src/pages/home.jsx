import React from "react";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to KnifeX!</h1>
            <p className="text-lg">Your one-stop solution for all your knife needs.</p>
            <button className="mt-6 px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-200 transition duration-300">Get Started</button>
        </div>
    );
}