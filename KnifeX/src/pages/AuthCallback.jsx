import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store the token and decode user info
      localStorage.setItem('token', token);
      
      try {
        // Decode JWT to get user info (you might want to validate this on the server)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          id: payload.userId,
          email: payload.email,
          username: payload.username
        };
        
        // Update auth context
        login(user, token);
        
        // Redirect to dashboard or home
        navigate('/');
      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        navigate('/login?error=oauth_failed');
      }
    } else {
      // No token received, redirect to login with error
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-white">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
