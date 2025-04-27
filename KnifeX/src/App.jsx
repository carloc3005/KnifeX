import React from 'react';
import Navbar from './pages/navbar'; // Import the Navbar component

function App() {
  return (
    <div> {/* Wrap content in a fragment or div if needed */}
      <Navbar /> {/* Add the Navbar component here */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <h1 className="text-5xl font-bold mb-4">Tailwind CSS is Working!</h1>
        <p className="text-lg">If you see this colorful layout, you're good to go ✅</p>
      </div>
    </div>
  );
}

export default App;

