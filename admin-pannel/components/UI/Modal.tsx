"use client";

import { ReactNode, useEffect } from "react";
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
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
			<div
				className="absolute inset-0 bg-black bg-opacity-50"
				onClick={onClose}
			/>
			<div className="relative bg-white rounded-t-lg md:rounded-lg shadow-xl w-full md:max-w-md mx-0 md:mx-4 animate-slide-up md:animate-none">
				<div className="flex justify-between items-center p-4 border-b">
					<h3 className="text-base md:text-lg font-semibold">{title}</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600"
					>
						<XIcon className="w-5 h-5" />
					</button>
				</div>
				<div className="p-4 max-h-[70vh] overflow-y-auto">{children}</div>
			</div>
		</div>
	);
}
