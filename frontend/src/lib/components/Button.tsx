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
