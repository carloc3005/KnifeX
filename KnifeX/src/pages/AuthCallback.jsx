import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          navigate('/login?error=oauth_failed');
          return;
        }

        if (code) {
          // Send the code to your backend to exchange for tokens
          const response = await fetch('/api/auth/oauth/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          const data = await response.json();

          if (response.ok && data.token) {
            // Store the token and user data
            localStorage.setItem('token', data.token);
            login(data.user, data.token);
            navigate('/'); // Redirect to home page
          } else {
            throw new Error(data.message || 'OAuth authentication failed');
          }
        } else {
          navigate('/login?error=no_code');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login?error=oauth_failed');
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authenticating...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we complete your login.
          </p>
          <div className="mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;