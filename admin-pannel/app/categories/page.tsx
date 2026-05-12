"use client";

import AdminLayout from "@/components/Layout/AdminLayout";
import { useEffect, useState } from "react";
import { categoryApi } from "@/lib/api";
import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";
import Input from "@/components/UI/Input";
import toast from "react-hot-toast";
import { Category } from "@/types";
import { EditIcon, TrashIcon, PlusIcon } from "lucide-react";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		order: 0,
		isActive: 1,
	});

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			const response = await categoryApi.getAll();
			setCategories(response.data);
		} catch (error) {
			console.error("Error fetching categories:", error);
			toast.error("Failed to load categories");
		} finally {
			setLoading(false);
		}
	};

	const handleOpenModal = (category?: Category) => {
		if (category) {
			setEditingCategory(category);
			setFormData({
				name: category.name,
				description: category.description,
				order: category.order,
				isActive: category.isActive,
			});
		} else {
			setEditingCategory(null);
			setFormData({
				name: "",
				description: "",
				order: categories.length,
				isActive: 1,
			});
		}
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setEditingCategory(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editingCategory) {
				await categoryApi.update(editingCategory.id, formData);
				toast.success("Category updated successfully");
			} else {
				await categoryApi.create(formData);
				toast.success("Category created successfully");
			}
			fetchCategories();
			handleCloseModal();
		} catch (error: any) {
			console.error("Error saving category:", error);
			toast.error(error.response?.data?.message || "Failed to save category");
		}
	};

	const handleDelete = async (id: number) => {
		if (
			confirm(
				"Are you sure you want to delete this category? This will also delete all products in this category.",
			)
		) {
			try {
				await categoryApi.delete(id);
				toast.success("Category deleted successfully");
				fetchCategories();
			} catch (error: any) {
				console.error("Error deleting category:", error);
				toast.error(
					error.response?.data?.message || "Failed to delete category",
				);
			}
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const target = e.target as HTMLInputElement;
		setFormData({
			...formData,
			[e.target.name]:
				target.type === "checkbox" ? (target.checked ? 1 : 0) : e.target.value,
		});
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
		<ProtectedRoute>
			<AdminLayout>
				<div className="mb-4 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold text-gray-800">
							Categories
						</h1>
						<p className="text-sm md:text-base text-gray-600 mt-1">
							Manage your product categories
						</p>
					</div>
					<Button onClick={() => handleOpenModal()}>
						<PlusIcon className="w-4 h-4 mr-2 inline" />
						Add Category
					</Button>
				</div>

				{/* Mobile Card View - Visible on mobile */}
				<div className="block md:hidden space-y-3">
					{categories.map((category) => (
						<div
							key={category.id}
							className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
						>
							<div className="flex justify-between items-start mb-2">
								<h3 className="font-semibold text-gray-800">{category.name}</h3>
								<div className="flex space-x-2">
									<button
										onClick={() => handleOpenModal(category)}
										className="text-blue-600 hover:text-blue-900 p-1"
									>
										<EditIcon className="w-4 h-4" />
									</button>
									<button
										onClick={() => handleDelete(category.id)}
										className="text-red-600 hover:text-red-900 p-1"
									>
										<TrashIcon className="w-4 h-4" />
									</button>
								</div>
							</div>
							{category.description && (
								<p className="text-sm text-gray-500 mb-2">
									{category.description}
								</p>
							)}
							<div className="flex justify-between items-center text-xs">
								<span className="text-gray-500">Order: {category.order}</span>
								<span
									className={`px-2 py-1 rounded-full text-xs font-semibold ${
										category.isActive
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{category.isActive ? "Active" : "Inactive"}
								</span>
							</div>
						</div>
					))}
					{categories.length === 0 && (
						<div className="text-center py-12 bg-white rounded-lg border">
							<p className="text-gray-500">
								No categories found. Click "Add Category" to create one.
							</p>
						</div>
					)}
				</div>

				{/* Desktop Table View - Hidden on mobile */}
				<div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Description
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Order
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{categories.map((category) => (
									<tr key={category.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">
												{category.name}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-500">
												{category.description || "-"}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">
												{category.order}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													category.isActive
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{category.isActive ? "Active" : "Inactive"}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<button
												onClick={() => handleOpenModal(category)}
												className="text-blue-600 hover:text-blue-900 mr-3"
											>
												<EditIcon className="w-4 h-4" />
											</button>
											<button
												onClick={() => handleDelete(category.id)}
												className="text-red-600 hover:text-red-900"
											>
												<TrashIcon className="w-4 h-4" />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{categories.length === 0 && (
						<div className="text-center py-12">
							<p className="text-gray-500">
								No categories found. Click "Add Category" to create one.
							</p>
						</div>
					)}
				</div>

				<Modal
					isOpen={modalOpen}
					onClose={handleCloseModal}
					title={editingCategory ? "Edit Category" : "Add Category"}
				>
					<form onSubmit={handleSubmit} className="space-y-4">
						<Input
							label="Category Name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
						/>

						<Input
							label="Description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							textarea
							rows={3}
						/>

						<Input
							label="Display Order"
							name="order"
							type="number"
							value={formData.order}
							onChange={handleChange}
						/>

						<div className="flex items-center">
							<input
								type="checkbox"
								id="isActive"
								name="isActive"
								checked={formData.isActive === 1}
								onChange={(e) =>
									setFormData({
										...formData,
										isActive: e.target.checked ? 1 : 0,
									})
								}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label
								htmlFor="isActive"
								className="ml-2 block text-sm text-gray-900"
							>
								Active
							</label>
						</div>

						<div className="flex justify-end space-x-3 pt-4">
							<Button
								variant="secondary"
								onClick={handleCloseModal}
								type="button"
							>
								Cancel
							</Button>
							<Button type="submit">
								{editingCategory ? "Update" : "Create"}
							</Button>
						</div>
					</form>
				</Modal>
			</AdminLayout>
		</ProtectedRoute>
	);
}
