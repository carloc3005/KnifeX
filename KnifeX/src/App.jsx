import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './pages/navbar';
import Home from './pages/home_new';
import About from './pages/about';
import Knives from './pages/knives';
import MyKnives from './pages/my-knives';
import Inventory from './pages/inventory';
import Footer from './pages/footer';
import Login from './pages/login';
import Signup from './pages/signup';
import AuthCallback from './pages/AuthCallback';

// Helper component to conditionally render Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const showLayout = location.pathname !== '/login' && 
                     location.pathname !== '/signup' && 
                     location.pathname !== '/auth/callback';

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
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/knives" element={<Knives />} />
            <Route path="/my-knives" element={<MyKnives />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            {/* Add other routes here as needed */}
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

