// import type { ButtonHTMLAttributes, ReactNode } from "react";

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   children: ReactNode;
// }

// export function Button({ children, ...props }: ButtonProps) {
//   return (
//     <button
//       className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }

// src/lib/components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	className?: string;
}

export function Button({ children, className, ...props }: ButtonProps) {
	return (
		<button
			className={`
                px-4 py-2 rounded-md font-semibold text-sm
                transition-colors duration-200 ease-in-out
                ${className || ''}
            `}
			{...props}
		>
			{children}
		</button>
	);
}
