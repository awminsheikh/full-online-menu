"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
	const router = useRouter();
	const { isAuthenticated, loading } = useAuth();

	useEffect(() => {
		if (!loading) {
			if (isAuthenticated) {
				router.push("/dashboard");
			} else {
				router.push("/login");
			}
		}
	}, [isAuthenticated, loading, router]);

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="text-gray-500">Loading...</div>
		</div>
	);
}
