"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
	children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, loading, router]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="text-gray-500">Loading...</div>
			</div>
		);
	}

	return isAuthenticated ? <>{children}</> : null;
}
