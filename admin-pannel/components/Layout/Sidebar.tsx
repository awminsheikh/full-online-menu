"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
	HomeIcon,
	StoreIcon,
	TagIcon,
	PackageIcon,
	SettingsIcon,
	MenuIcon,
	XIcon,
	UserIcon,
} from "lucide-react";

const menuItems = [
	{ name: "Dashboard", href: "/dashboard", icon: HomeIcon },
	{ name: "Shop Info", href: "/shop", icon: StoreIcon },
	{ name: "Categories", href: "/categories", icon: TagIcon },
	{ name: "Products", href: "/products", icon: PackageIcon },
	{ name: 'Admins', href: '/admins', icon: UserIcon },
	{ name: "Settings", href: "/settings", icon: SettingsIcon },
];

export default function Sidebar() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);
			if (!mobile) {
				setIsOpen(true);
			} else {
				setIsOpen(false);
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	const closeSidebar = () => {
		if (isMobile) {
			setIsOpen(false);
		}
	};

	return (
		<>
			{/* Mobile Menu Button - Fixed positioning */}
			{isMobile && (
				<button
					onClick={toggleSidebar}
					className="fixed top-3 left-3 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
					aria-label="Toggle menu"
				>
					{isOpen ? (
						<XIcon className="w-5 h-5" />
					) : (
						<MenuIcon className="w-5 h-5" />
					)}
				</button>
			)}

			{/* Overlay for mobile */}
			{isMobile && isOpen && (
				<div
					className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 transition-opacity duration-300"
					onClick={closeSidebar}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`
        fixed top-0 left-0 h-full bg-gray-900 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        w-64 shadow-xl
      `}
			>
				<div className="p-4 pt-16 md:pt-4 border-b border-gray-800">
					<h1 className="text-white text-xl font-bold">Coffee Shop</h1>
					<p className="text-gray-400 text-sm mt-1">Admin Panel</p>
				</div>

				<nav className="mt-6">
					{menuItems.map((item) => {
						const isActive = pathname === item.href;
						const Icon = item.icon;

						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={closeSidebar}
								className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors ${
									isActive
										? "bg-gray-800 text-white border-r-4 border-blue-500"
										: ""
								}`}
							>
								<Icon className="w-5 h-5 mr-3 shrink-0" />
								<span className="text-sm">{item.name}</span>
							</Link>
						);
					})}
				</nav>
			</aside>
		</>
	);
}
