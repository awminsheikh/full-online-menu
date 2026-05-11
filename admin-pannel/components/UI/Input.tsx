"use client";

interface InputProps {
	label: string;
	name: string;
	type?: string;
	value: string | number;
	onChange: (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => void;
	required?: boolean;
	rows?: number;
	textarea?: boolean;
	step?: string;
	min?: number;
	max?: number;
}

export default function Input({
	label,
	name,
	type = "text",
	value,
	onChange,
	required = false,
	rows = 3,
	textarea = false,
	step,
	min,
	max,
}: InputProps) {
	return (
		<div>
			<label
				htmlFor={name}
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			{textarea ? (
				<textarea
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					rows={rows}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			) : (
				<input
					type={type}
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					required={required}
					step={step}
					min={min}
					max={max}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			)}
		</div>
	);
}
