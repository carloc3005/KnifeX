import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import backgroundImage from "../assets/images/login-signup.png";

export default function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const { login } = useAuth();
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

		try {
			await login(formData);
			navigate('/'); // Redirect to home page after successful login
		} catch (err) {
			setError(err.message || 'Login failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex min-h-screen bg-gray-50"> {/* Changed page background to a very light gray */}
			{/* Left Panel */}
			<div
				className="flex-1 bg-cover bg-center relative hidden md:flex flex-col justify-center items-center text-white p-10"
				style={{ backgroundImage: `url(${backgroundImage})` }}
			>
				<div className="absolute inset-0 bg-black opacity-30"></div> {/* Optional: Dark overlay for better text readability */}
				<div className="relative z-10 text-center">
					<h1 className="text-5xl font-bold mb-4">Your Premier Hub for CS2 Knife Trading</h1>
					<p className="text-xl">Discover rare skins, connect with traders, and secure the best deals.</p>
				</div>
			</div>

			{/* Right Panel - Form */}
			<div className="flex-1 bg-white flex flex-col justify-center items-center p-6 sm:p-12">
				<div className="w-full max-w-md space-y-6">
					<div className="text-left">
						<h2 className="mt-1 text-3xl font-bold text-gray-900">Login</h2>
						<p className="mt-2 text-sm text-gray-600">Welcome Back! Please enter your details.</p>
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
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								value={formData.password}
								onChange={handleChange}
								className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Enter your password"
							/>
						</div>

						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="size-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
								/>
								<label htmlFor="remember-me" className="ml-2 block text-gray-900">
									Remember me for 30 days
								</label>
							</div>
							<a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
								Forgot Password?
							</a>
						</div>

						<div>
							<button
								type="submit"
								disabled={loading}
								className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? 'Logging in...' : 'Log in'}
							</button>
						</div>
						<div>
							<Link
								to="/signup" // Add the route to the signup page
								className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Register
							</Link>
						</div>
					</form>

					<p className="mt-8 text-center text-sm text-gray-600">
						Don't have an account? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up for free</Link>
					</p>
				</div>
			</div>
		</div>
	);
}