"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		router.push("/dashboard");
	}, [router]);

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="text-gray-500">Redirecting to dashboard...</div>
		</div>
	);
}
