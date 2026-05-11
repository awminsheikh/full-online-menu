"use client";

import { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	variant?: "primary" | "secondary" | "danger";
	onClick?: () => void;
	type?: "button" | "submit";
	disabled?: boolean;
}

export default function Button({
	children,
	variant = "primary",
	onClick,
	type = "button",
	disabled = false,
}: ButtonProps) {
	const variants = {
		primary: "bg-blue-600 hover:bg-blue-700 text-white",
		secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
		danger: "bg-red-600 hover:bg-red-700 text-white",
	};

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`px-4 py-2 rounded-lg transition-colors ${variants[variant]} ${
				disabled ? "opacity-50 cursor-not-allowed" : ""
			}`}
		>
			{children}
		</button>
	);
}
