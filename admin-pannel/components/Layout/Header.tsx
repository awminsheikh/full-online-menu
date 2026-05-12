"use client";

import { useState, useEffect } from "react";
import { BellIcon, UserIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
	const [showDropdown, setShowDropdown] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const { admin, logout } = useAuth();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const handleLogout = async () => {
		await logout();
	};

	return (
		<header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-3">
			<div className="flex justify-end md:justify-between items-center">
				<div className="hidden md:block">
					<h2 className="text-xl font-semibold text-gray-800">
						Welcome back, {admin?.username || "Admin"}
					</h2>
					<p className="text-sm text-gray-500">Manage your coffee shop menu</p>
				</div>

				<div className="flex items-center space-x-2 md:space-x-4">
					<button className="p-2 hover:bg-gray-100 rounded-full relative">
						<BellIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
						<span className="absolute top-1 right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full"></span>
					</button>

					<div className="relative">
						<button
							onClick={() => setShowDropdown(!showDropdown)}
							className="flex items-center space-x-2 p-1 md:p-2 hover:bg-gray-100 rounded-lg"
						>
							<div className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center">
								<UserIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
							</div>
							<span className="text-sm font-medium text-gray-700 hidden sm:inline">
								{admin?.username || "Admin"}
							</span>
						</button>

						{showDropdown && (
							<>
								<div
									className="fixed inset-0 z-40"
									onClick={() => setShowDropdown(false)}
								/>
								<div className="absolute right-0 mt-2 w-40 md:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
									<button
										onClick={handleLogout}
										className="w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-red-600 hover:bg-gray-100 flex items-center"
									>
										<LogOutIcon className="w-3 h-3 md:w-4 md:h-4 mr-2" />
										Logout
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
