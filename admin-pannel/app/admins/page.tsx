"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AdminLayout from "@/components/Layout/AdminLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";
import Input from "@/components/UI/Input";
import toast from "react-hot-toast";
import { TrashIcon, PlusIcon, ShieldIcon, UserIcon } from "lucide-react";

interface AdminUser {
	id: number;
	username: string;
	role: string;
	created_at: string;
	created_by_username?: string;
}

function AdminsContent() {
	const [admins, setAdmins] = useState<AdminUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
	});
	const { admin: currentAdmin } = useAuth();

	useEffect(() => {
		fetchAdmins();
	}, []);

	const fetchAdmins = async () => {
		try {
			const response = await api.get("/auth/all");
			setAdmins(response.data);
		} catch (error) {
			console.error("Error fetching admins:", error);
			toast.error("Failed to load admins");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateAdmin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (formData.password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}

		try {
			await api.post("/auth/create", {
				username: formData.username,
				password: formData.password,
			});
			toast.success("Admin created successfully");
			setModalOpen(false);
			setFormData({ username: "", password: "", confirmPassword: "" });
			fetchAdmins();
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to create admin");
		}
	};

	const handleDeleteAdmin = async (id: number, username: string) => {
		if (username === currentAdmin?.username) {
			toast.error("Cannot delete your own account");
			return;
		}

		if (confirm(`Are you sure you want to delete admin "${username}"?`)) {
			try {
				await api.delete(`/auth/delete/${id}`);
				toast.success("Admin deleted successfully");
				fetchAdmins();
			} catch (error: any) {
				toast.error(error.response?.data?.message || "Failed to delete admin");
			}
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
			<div className="mb-4 md:mb-8">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold text-gray-800">
							Admin Users
						</h1>
						<p className="text-sm md:text-base text-gray-600 mt-1">
							Manage administrator accounts
						</p>
					</div>
					<Button onClick={() => setModalOpen(true)}>
						<PlusIcon className="w-4 h-4 mr-2 inline" />
						Add Admin
					</Button>
				</div>
			</div>

			{/* Mobile Card View */}
			<div className="block md:hidden space-y-3">
				{admins.map((admin) => (
					<div
						key={admin.id}
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
					>
						<div className="flex justify-between items-start mb-2">
							<div className="flex items-center space-x-2">
								<UserIcon className="w-5 h-5 text-gray-500" />
								<h3 className="font-semibold text-gray-800">
									{admin.username}
								</h3>
							</div>
							{currentAdmin?.username !== admin.username && (
								<button
									onClick={() => handleDeleteAdmin(admin.id, admin.username)}
									className="text-red-600 hover:text-red-900 p-1"
								>
									<TrashIcon className="w-4 h-4" />
								</button>
							)}
						</div>
						<div className="space-y-1 text-sm">
							<p className="text-gray-600">
								<span className="font-medium">Role:</span>{" "}
								<span
									className={`px-2 py-0.5 rounded-full text-xs ${
										admin.role === "super_admin"
											? "bg-purple-100 text-purple-800"
											: "bg-blue-100 text-blue-800"
									}`}
								>
									{admin.role}
								</span>
							</p>
							<p className="text-gray-500 text-xs">
								Created: {new Date(admin.created_at).toLocaleDateString()}
							</p>
							{admin.created_by_username && (
								<p className="text-gray-500 text-xs">
									By: {admin.created_by_username}
								</p>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Desktop Table View */}
			<div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									ID
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Username
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Role
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Created By
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Created At
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{admins.map((admin) => (
								<tr key={admin.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{admin.id}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{admin.username}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												admin.role === "super_admin"
													? "bg-purple-100 text-purple-800"
													: "bg-blue-100 text-blue-800"
											}`}
										>
											{admin.role}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{admin.created_by_username || "-"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{new Date(admin.created_at).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										{currentAdmin?.username !== admin.username && (
											<button
												onClick={() =>
													handleDeleteAdmin(admin.id, admin.username)
												}
												className="text-red-600 hover:text-red-900"
											>
												<TrashIcon className="w-4 h-4" />
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Create Admin Modal */}
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Add New Admin"
			>
				<form onSubmit={handleCreateAdmin} className="space-y-4">
					<Input
						label="Username"
						name="username"
						value={formData.username}
						onChange={(e) =>
							setFormData({ ...formData, username: e.target.value })
						}
						required
					/>

					<Input
						label="Password"
						name="password"
						type="password"
						value={formData.password}
						onChange={(e) =>
							setFormData({ ...formData, password: e.target.value })
						}
						required
					/>

					<Input
						label="Confirm Password"
						name="confirmPassword"
						type="password"
						value={formData.confirmPassword}
						onChange={(e) =>
							setFormData({ ...formData, confirmPassword: e.target.value })
						}
						required
					/>

					<div className="flex justify-end space-x-3 pt-4">
						<Button
							variant="secondary"
							onClick={() => setModalOpen(false)}
							type="button"
						>
							Cancel
						</Button>
						<Button type="submit">Create Admin</Button>
					</div>
				</form>
			</Modal>
		</AdminLayout>
	);
}

export default function AdminsPage() {
	return (
		<ProtectedRoute>
			<AdminsContent />
		</ProtectedRoute>
	);
}
