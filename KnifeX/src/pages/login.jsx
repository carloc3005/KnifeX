import React from 'react';
import signupImage from "../assets/images/cs2-signup.png"; // You might want to change this image to match the example

// Placeholder for Google Icon - replace with an actual SVG or icon component
const GoogleIcon = () => (
	<svg className="mr-2 size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
);

export default function Login() {
	return (
		<div className="flex min-h-screen bg-gray-50"> {/* Changed page background to a very light gray */}
			{/* Left Panel */}
			<div
				className="flex-1 bg-cover bg-center relative hidden md:flex flex-col justify-center items-center text-white p-10"
				style={{ backgroundImage: `url(${signupImage})` }}
			>
				<div className="absolute inset-0 bg-black opacity-30"></div> {/* Optional: Dark overlay for better text readability */}
				<div className="relative z-10 text-center">
					<h1 className="text-5xl font-bold mb-4">Turn Your Ideas into reality</h1>
					<p className="text-xl">Start for free and get attractive offers from the community</p>
				</div>
			</div>

			{/* Right Panel - Form */}
			<div className="flex-1 bg-white flex flex-col justify-center items-center p-6 sm:p-12">
				<div className="w-full max-w-md space-y-6">
					<div className="text-left">
						<p className="text-sm font-semibold text-gray-600">Interactive Brand</p>
						<h2 className="mt-1 text-3xl font-bold text-gray-900">Login</h2>
						<p className="mt-2 text-sm text-gray-600">Welcome Back! Please enter your details.</p>
					</div>

					<form className="space-y-5">
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
								className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
							>
								Log in
							</button>
						</div>
						<div>
							<button
								type="button" // Changed to type button if it doesn't submit the form
								className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Register
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
						<button
							type="button"
							className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							<GoogleIcon />
							Sign In With Google
						</button>
					</div>

					<p className="mt-8 text-center text-sm text-gray-600">
						Don't have an account? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up for free</a>
					</p>
				</div>
			</div>
		</div>
	);
}