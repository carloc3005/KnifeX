import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './pages/navbar';
import Home from './pages/home';
import About from './pages/about'; // Import the About component
import Footer from './pages/footer';
import Login from './pages/login'; // Import the Login component
import Signup from './pages/signup'; // Import the Signup component

// Helper component to conditionally render Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const showLayout = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <>
      {showLayout && <Navbar />}
      {children}
      {showLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> {/* Add route for About page */}
          <Route path="/login" element={<Login />} /> {/* Add route for Login page */}
          <Route path="/signup" element={<Signup />} /> {/* Add route for Signup page */}
          {/* Add other routes here as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

