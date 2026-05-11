"use client";

import AdminLayout from "@/components/Layout/AdminLayout";
import { useEffect, useState } from "react";
import { shopApi, categoryApi, productApi } from "@/lib/api";
import { StoreIcon, TagIcon, PackageIcon, TrendingUpIcon } from "lucide-react";

interface Stats {
	totalCategories: number;
	totalProducts: number;
	activeProducts: number;
	popularProducts: number;
}

export default function Dashboard() {
	const [stats, setStats] = useState<Stats>({
		totalCategories: 0,
		totalProducts: 0,
		activeProducts: 0,
		popularProducts: 0,
	});
	const [shopName, setShopName] = useState("");

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const [shopRes, categoriesRes, productsRes] = await Promise.all([
				shopApi.getInfo(),
				categoryApi.getAll(),
				productApi.getAll(),
			]);

			setShopName(shopRes.data.name);
			const products = productsRes.data;
			setStats({
				totalCategories: categoriesRes.data.length,
				totalProducts: products.length,
				activeProducts: products.filter((p) => p.isAvailable === 1).length,
				popularProducts: products.filter((p) => p.isPopular === 1).length,
			});
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const statCards = [
		{
			title: "Total Categories",
			value: stats.totalCategories,
			icon: TagIcon,
			color: "bg-blue-500",
		},
		{
			title: "Total Products",
			value: stats.totalProducts,
			icon: PackageIcon,
			color: "bg-green-500",
		},
		{
			title: "Active Products",
			value: stats.activeProducts,
			icon: StoreIcon,
			color: "bg-yellow-500",
		},
		{
			title: "Popular Products",
			value: stats.popularProducts,
			icon: TrendingUpIcon,
			color: "bg-purple-500",
		},
	];

	return (
		<AdminLayout>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
				<p className="text-gray-600 mt-1">Welcome to {shopName} admin panel</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{statCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<div
							key={index}
							className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500 mb-1">{stat.title}</p>
									<p className="text-3xl font-bold text-gray-800">
										{stat.value}
									</p>
								</div>
								<div className={`${stat.color} p-3 rounded-full`}>
									<Icon className="w-6 h-6 text-white" />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
					<div className="space-y-3">
						<button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
							➕ Add New Category
						</button>
						<button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
							📦 Add New Product
						</button>
						<button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
							✏️ Update Shop Information
						</button>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold mb-4">System Info</h2>
					<div className="space-y-2 text-sm">
						<p className="flex justify-between">
							<span className="text-gray-500">API Status:</span>
							<span className="text-green-600 font-medium">● Online</span>
						</p>
						<p className="flex justify-between">
							<span className="text-gray-500">Database:</span>
							<span className="text-gray-800">SQLite</span>
						</p>
						<p className="flex justify-between">
							<span className="text-gray-500">Version:</span>
							<span className="text-gray-800">1.0.0</span>
						</p>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
