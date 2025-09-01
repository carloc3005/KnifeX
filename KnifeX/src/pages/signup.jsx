// filepath: d:\KnifeX\KnifeX\src\pages\signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import backgroundImage from "../assets/images/login-signup.png";

export default function Signup() {
	const [formData, setFormData] = useState({
		email: '',
		username: '',
		password: '',
		confirmPassword: ''
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const { register } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		// Validate passwords match
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			setLoading(false);
			return;
		}

		// Validate password length
		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters long');
			setLoading(false);
			return;
		}

		try {
			await register({
				email: formData.email,
				username: formData.username,
				password: formData.password
			});
			navigate('/'); // Redirect to home page after successful registration
		} catch (err) {
			setError(err.message || 'Registration failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Left Panel */}
			<div
				className="flex-1 bg-cover bg-center relative hidden md:flex flex-col justify-center items-center text-white p-10"
				style={{ backgroundImage: `url(${backgroundImage})` }}
			>
				<div className="absolute inset-0 bg-black opacity-30"></div>
				<div className="relative z-10 text-center">
					<h1 className="text-5xl font-bold mb-4">Join the KnifeX Community</h1>
					<p className="text-xl">Sign up to start trading CS2 skins and find the best deals.</p>
				</div>
			</div>

			{/* Right Panel - Form */}
			<div className="flex-1 bg-white flex flex-col justify-center items-center p-6 sm:p-12">
				<div className="w-full max-w-md space-y-6">
					<div className="text-left">
						<h2 className="mt-1 text-3xl font-bold text-gray-900">Create Account</h2>
						<p className="mt-2 text-sm text-gray-600">Let's get you started!</p>
					</div>

					<form className="space-y-5" onSubmit={handleSubmit}>
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-md p-3">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Enter your email"
							/>
						</div>

						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
								Username
							</label>
							<input
								id="username"
								name="username"
								type="text"
								autoComplete="username"
								required
								value={formData.username}
								onChange={handleChange}
								className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Choose a username"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								value={formData.password}
								onChange={handleChange}
								className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Create a password (min 6 characters)"
							/>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
								className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Confirm your password"
							/>
						</div>

						<div>
							<button
								type="submit"
								disabled={loading}
								className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? 'Creating Account...' : 'Sign Up'}
							</button>
						</div>
					</form>

					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center" aria-hidden="true">
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">or</span>
						</div>
					</div>

					<div>
						<GoogleLoginButton />
					</div>

					<div className="mt-4">
						<Link
							to="/login"
							className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						>
							Back to Login
						</Link>
					</div>

					<p className="mt-8 text-center text-sm text-gray-600">
						Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
