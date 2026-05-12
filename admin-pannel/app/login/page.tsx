"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StoreIcon } from "lucide-react";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await login(username, password);
		} catch (err: any) {
			setError(err.message || "Login failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				<div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-full mb-4">
							<StoreIcon className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
						</div>
						<h1 className="text-2xl md:text-3xl font-bold text-gray-800">
							Coffee Shop Admin
						</h1>
						<p className="text-sm md:text-base text-gray-500 mt-2">
							Sign in to manage your menu
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Username
							</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
								placeholder="Enter your username"
								required
								autoComplete="username"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
								placeholder="Enter your password"
								required
								autoComplete="current-password"
							/>
						</div>

						{error && (
							<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
								{error}
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-amber-600 text-white py-2.5 rounded-lg hover:bg-amber-700 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Signing in..." : "Sign In"}
						</button>
					</form>

					<div className="mt-6 pt-4 border-t border-gray-200">
						<div className="text-center text-xs text-gray-500">
							<p>Demo credentials:</p>
							<p className="font-mono text-xs mt-1">Username: admin</p>
							<p className="font-mono text-xs">Password: admin123</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
