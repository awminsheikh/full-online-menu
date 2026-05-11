"use client";

import { ReactNode } from "react";
import { XIcon } from "lucide-react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
}

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
}: ModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black bg-opacity-50"
				onClick={onClose}
			/>
			<div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
				<div className="flex justify-between items-center p-4 border-b">
					<h3 className="text-lg font-semibold">{title}</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600"
					>
						<XIcon className="w-5 h-5" />
					</button>
				</div>
				<div className="p-4">{children}</div>
			</div>
		</div>
	);
}
