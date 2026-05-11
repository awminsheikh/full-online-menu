"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AdminLayoutProps {
	children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 ml-64">
				<Header />
				<main className="p-6">{children}</main>
			</div>
		</div>
	);
}
