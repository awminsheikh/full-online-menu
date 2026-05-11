"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	HomeIcon,
	StoreIcon,
	TagIcon,
	PackageIcon,
	SettingsIcon,
} from "lucide-react";

const menuItems = [
	{ name: "Dashboard", href: "/dashboard", icon: HomeIcon },
	{ name: "Shop Info", href: "/shop", icon: StoreIcon },
	{ name: "Categories", href: "/categories", icon: TagIcon },
	{ name: "Products", href: "/products", icon: PackageIcon },
	{ name: "Settings", href: "/settings", icon: SettingsIcon },
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="w-64 bg-gray-900 min-h-screen fixed left-0 top-0">
			<div className="p-4 border-b border-gray-800">
				<h1 className="text-white text-xl font-bold">Coffee Shop Admin</h1>
				<p className="text-gray-400 text-sm">Management Panel</p>
			</div>

			<nav className="mt-6">
				{menuItems.map((item) => {
					const isActive = pathname === item.href;
					const Icon = item.icon;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors ${
								isActive
									? "bg-gray-800 text-white border-r-4 border-blue-500"
									: ""
							}`}
						>
							<Icon className="w-5 h-5 mr-3" />
							<span>{item.name}</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
