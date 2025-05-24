import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './pages/navbar';
import Home from './pages/home';
import About from './pages/about'; // Import the About component
import Footer from './pages/footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} /> {/* Add route for About page */}
        {/* Add other routes here as needed */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

