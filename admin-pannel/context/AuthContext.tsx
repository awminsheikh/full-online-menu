"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Admin {
	id: number;
	username: string;
	role: string;
}

interface AuthContextType {
	admin: Admin | null;
	loading: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
	isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [admin, setAdmin] = useState<Admin | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const response = await api.get("/auth/me", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setAdmin(response.data);
				// Set default authorization header for future requests
				api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			} catch (error) {
				console.error("Auth check failed:", error);
				localStorage.removeItem("token");
				delete api.defaults.headers.common["Authorization"];
				setAdmin(null);
			}
		}
		setLoading(false);
	};

	const login = async (username: string, password: string) => {
		try {
			const response = await api.post("/auth/login", { username, password });
			const { token, admin } = response.data;

			// Store token in localStorage
			localStorage.setItem("token", token);

			// Set the default authorization header for future requests
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

			setAdmin({
				id: admin.id,
				username: admin.username,
				role: admin.role,
			});

			toast.success(`Welcome back, ${admin.username}!`);
			router.push("/dashboard");
		} catch (error: any) {
			console.error("Login error:", error);
			const errorMessage =
				error.response?.data?.message ||
				"Login failed. Please check your credentials.";
			toast.error(errorMessage);
			throw new Error(errorMessage);
		}
	};

	const logout = async () => {
		try {
			await api.post("/auth/logout");
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			localStorage.removeItem("token");
			delete api.defaults.headers.common["Authorization"];
			setAdmin(null);
			toast.success("Logged out successfully");
			router.push("/login");
		}
	};

	return (
		<AuthContext.Provider
			value={{
				admin,
				loading,
				login,
				logout,
				isAuthenticated: !!admin,
				isSuperAdmin: admin?.role === "super_admin",
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
