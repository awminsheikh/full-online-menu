"use client";

import AdminLayout from "@/components/Layout/AdminLayout";
import { useEffect, useState } from "react";
import { shopApi } from "@/lib/api";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import toast from "react-hot-toast";
import { Shop } from "@/types";

export default function ShopPage() {
	const [shop, setShop] = useState<Shop | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetchShop();
	}, []);

	const fetchShop = async () => {
		try {
			const response = await shopApi.getInfo();
			setShop(response.data);
		} catch (error) {
			console.error("Error fetching shop:", error);
			toast.error("Failed to load shop information");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!shop) return;

		setSaving(true);
		try {
			await shopApi.updateInfo(shop);
			toast.success("Shop information updated successfully!");
		} catch (error) {
			console.error("Error updating shop:", error);
			toast.error("Failed to update shop information");
		} finally {
			setSaving(false);
		}
	};

	// Fixed: Added HTMLSelectElement to the type
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		if (shop) {
			setShop({ ...shop, [e.target.name]: e.target.value });
		}
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="flex justify-center items-center h-64">
					<div className="text-gray-500">Loading...</div>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="max-w-3xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-800">Shop Information</h1>
					<p className="text-gray-600 mt-1">Manage your coffee shop details</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
				>
					<div className="space-y-6">
						<Input
							label="Shop Name"
							name="name"
							value={shop?.name || ""}
							onChange={handleChange}
							required
						/>

						<Input
							label="Address"
							name="address"
							value={shop?.address || ""}
							onChange={handleChange}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								label="Phone"
								name="phone"
								value={shop?.phone || ""}
								onChange={handleChange}
							/>

							<Input
								label="Email"
								name="email"
								type="email"
								value={shop?.email || ""}
								onChange={handleChange}
							/>
						</div>

						<Input
							label="Opening Hours"
							name="openingHours"
							value={shop?.openingHours || ""}
							onChange={handleChange}
						/>

						<Input
							label="Description"
							name="description"
							value={shop?.description || ""}
							onChange={handleChange}
							textarea
							rows={4}
						/>

						<Input
							label="Logo URL"
							name="logo"
							value={shop?.logo || ""}
							onChange={handleChange}
						/>

						<div className="flex justify-end pt-4">
							<Button type="submit" disabled={saving}>
								{saving ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</AdminLayout>
	);
}
