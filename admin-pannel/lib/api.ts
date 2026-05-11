import { Shop, Category, Product } from "@/types";
import axios from "axios";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Simple auth interceptor (you can expand this later)
api.interceptors.request.use((config) => {
	// You can add token here if you implement authentication
	const token = localStorage.getItem("admin_token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Shop APIs
export const shopApi = {
	getInfo: () => api.get<Shop>("/shop"),
	updateInfo: (data: Partial<Shop>) => api.put<Shop>("/shop", data),
};

// Category APIs
export const categoryApi = {
	getAll: () => api.get<Category[]>("/categories"),
	getById: (id: number) => api.get<Category>(`/categories/${id}`),
	create: (data: Omit<Category, "id" | "created_at" | "updated_at">) =>
		api.post<Category>("/categories", data),
	update: (id: number, data: Partial<Category>) =>
		api.put<Category>(`/categories/${id}`, data),
	delete: (id: number) => api.delete(`/categories/${id}`),
};

// Product APIs
export const productApi = {
	getAll: () => api.get<Product[]>("/products"),
	getById: (id: number) => api.get<Product>(`/products/${id}`),
	getByCategory: (categoryId: number) =>
		api.get<Product[]>(`/products/category/${categoryId}`),
	create: (
		data: Omit<Product, "id" | "created_at" | "updated_at" | "category_name">,
	) => api.post<Product>("/products", data),
	update: (id: number, data: Partial<Product>) =>
		api.put<Product>(`/products/${id}`, data),
	delete: (id: number) => api.delete(`/products/${id}`),
};

export default api;
