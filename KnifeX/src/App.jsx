import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Navbar from './pages/navbar';
import Home from './pages/home'; 

function App() {
  return (
    <div>
      <Navbar /> 
      <Routes> 
        <Route path="/" element={<Home />} /> 
        {/* Add other routes here as needed */}
      </Routes>
    </div>
  );
}

export default App;

