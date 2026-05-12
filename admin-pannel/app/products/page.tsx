"use client";

import AdminLayout from "@/components/Layout/AdminLayout";
import { useEffect, useState } from "react";
import { productApi, categoryApi } from "@/lib/api";
import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";
import Input from "@/components/UI/Input";
import toast from "react-hot-toast";
import { Product, Category } from "@/types";
import { EditIcon, TrashIcon, PlusIcon } from "lucide-react";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: 0,
		category_id: 0,
		image: "",
		isAvailable: 1,
		isPopular: 0,
		order: 0,
	});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const [productsRes, categoriesRes] = await Promise.all([
				productApi.getAll(),
				categoryApi.getAll(),
			]);
			setProducts(productsRes.data);
			setCategories(categoriesRes.data.filter((c) => c.isActive === 1));
		} catch (error) {
			console.error("Error fetching data:", error);
			toast.error("Failed to load products");
		} finally {
			setLoading(false);
		}
	};

	const handleOpenModal = (product?: Product) => {
		if (product) {
			setEditingProduct(product);
			setFormData({
				name: product.name,
				description: product.description,
				price: product.price,
				category_id: product.category_id,
				image: product.image,
				isAvailable: product.isAvailable,
				isPopular: product.isPopular,
				order: product.order,
			});
		} else {
			setEditingProduct(null);
			setFormData({
				name: "",
				description: "",
				price: 0,
				category_id: categories[0]?.id || 0,
				image: "",
				isAvailable: 1,
				isPopular: 0,
				order: products.length,
			});
		}
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setEditingProduct(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editingProduct) {
				await productApi.update(editingProduct.id, formData);
				toast.success("Product updated successfully");
			} else {
				await productApi.create(formData);
				toast.success("Product created successfully");
			}
			fetchData();
			handleCloseModal();
		} catch (error: any) {
			console.error("Error saving product:", error);
			toast.error(error.response?.data?.message || "Failed to save product");
		}
	};

	const handleDelete = async (id: number) => {
		if (confirm("Are you sure you want to delete this product?")) {
			try {
				await productApi.delete(id);
				toast.success("Product deleted successfully");
				fetchData();
			} catch (error: any) {
				console.error("Error deleting product:", error);
				toast.error(
					error.response?.data?.message || "Failed to delete product",
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
		let value: string | number = e.target.value;

		if (target.type === "checkbox") {
			value = target.checked ? 1 : 0;
		} else if (e.target.name === "price") {
			value = parseFloat(e.target.value) || 0;
		} else if (e.target.name === "order") {
			value = parseInt(e.target.value) || 0;
		}

		setFormData({
			...formData,
			[e.target.name]: value,
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
				<div className="mb-8 flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold text-gray-800">Products</h1>
						<p className="text-gray-600 mt-1">Manage your menu products</p>
					</div>
					<Button onClick={() => handleOpenModal()}>
						<PlusIcon className="w-4 h-4 mr-2 inline" />
						Add Product
					</Button>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Category
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Price
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Popular
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{products.map((product) => (
								<tr key={product.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{product.name}
										</div>
										<div className="text-sm text-gray-500">
											{product.description?.substring(0, 50)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-500">
											{product.category_name}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											${product.price.toFixed(2)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												product.isAvailable
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{product.isAvailable ? "Available" : "Unavailable"}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{product.isPopular ? "⭐ Yes" : "No"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button
											onClick={() => handleOpenModal(product)}
											className="text-blue-600 hover:text-blue-900 mr-3"
										>
											<EditIcon className="w-4 h-4" />
										</button>
										<button
											onClick={() => handleDelete(product.id)}
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

				<Modal
					isOpen={modalOpen}
					onClose={handleCloseModal}
					title={editingProduct ? "Edit Product" : "Add Product"}
				>
					<form
						onSubmit={handleSubmit}
						className="space-y-4 max-h-96 overflow-y-auto"
					>
						<Input
							label="Product Name"
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

						<div className="grid grid-cols-2 gap-4">
							<Input
								label="Price"
								name="price"
								type="number"
								value={formData.price}
								onChange={handleChange}
								step="0.01"
								min={0}
								required
							/>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Category *
								</label>
								<select
									name="category_id"
									value={formData.category_id}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								>
									<option value={0}>Select a category</option>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<Input
							label="Image URL"
							name="image"
							value={formData.image}
							onChange={handleChange}
						/>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center">
								<input
									type="checkbox"
									id="isAvailable"
									name="isAvailable"
									checked={formData.isAvailable === 1}
									onChange={(e) =>
										setFormData({
											...formData,
											isAvailable: e.target.checked ? 1 : 0,
										})
									}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label
									htmlFor="isAvailable"
									className="ml-2 block text-sm text-gray-900"
								>
									Available
								</label>
							</div>

							<div className="flex items-center">
								<input
									type="checkbox"
									id="isPopular"
									name="isPopular"
									checked={formData.isPopular === 1}
									onChange={(e) =>
										setFormData({
											...formData,
											isPopular: e.target.checked ? 1 : 0,
										})
									}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label
									htmlFor="isPopular"
									className="ml-2 block text-sm text-gray-900"
								>
									Popular
								</label>
							</div>
						</div>

						<Input
							label="Display Order"
							name="order"
							type="number"
							value={formData.order}
							onChange={handleChange}
						/>

						<div className="flex justify-end space-x-3 pt-4">
							<Button
								variant="secondary"
								onClick={handleCloseModal}
								type="button"
							>
								Cancel
							</Button>
							<Button type="submit">
								{editingProduct ? "Update" : "Create"}
							</Button>
						</div>
					</form>
				</Modal>
			</AdminLayout>
		</ProtectedRoute>
	);
}
