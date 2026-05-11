export interface Shop {
	id: number;
	name: string;
	address: string;
	phone: string;
	email: string;
	openingHours: string;
	description: string;
	logo: string;
	updated_at: string;
}

export interface Category {
	id: number;
	name: string;
	description: string;
	order: number;
	isActive: number;
	created_at: string;
	updated_at: string;
}

export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	category_id: number;
	category_name?: string;
	image: string;
	isAvailable: number;
	isPopular: number;
	order: number;
	created_at: string;
	updated_at: string;
}

export interface ApiResponse<T> {
	message?: string;
	data?: T;
}
