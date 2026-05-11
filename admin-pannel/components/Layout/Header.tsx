"use client";

import { useState } from "react";
import { BellIcon, UserIcon, LogOutIcon } from "lucide-react";

export default function Header() {
	const [showDropdown, setShowDropdown] = useState(false);

	return (
		<header className="bg-white border-b border-gray-200 px-6 py-3">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-xl font-semibold text-gray-800">
						Welcome back, Admin
					</h2>
					<p className="text-sm text-gray-500">Manage your coffee shop menu</p>
				</div>

				<div className="flex items-center space-x-4">
					<button className="p-2 hover:bg-gray-100 rounded-full relative">
						<BellIcon className="w-5 h-5 text-gray-600" />
						<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
					</button>

					<div className="relative">
						<button
							onClick={() => setShowDropdown(!showDropdown)}
							className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
						>
							<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
								<UserIcon className="w-4 h-4 text-white" />
							</div>
							<span className="text-sm font-medium text-gray-700">Admin</span>
						</button>

						{showDropdown && (
							<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
								<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
									<LogOutIcon className="w-4 h-4 mr-2" />
									Logout
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
