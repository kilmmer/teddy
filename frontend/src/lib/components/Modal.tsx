// import React from 'react';

// interface ModalProps {
// 	isOpen: boolean;
// 	onClose: () => void;
// 	children: React.ReactNode;
// 	title?: string;
// 	className?: string;
// }

// export function Modal({
// 	isOpen,
// 	onClose,
// 	children,
// 	title = 'Modal',
// 	className,
// }: ModalProps) {
// 	// Se o modal não estiver aberto, não renderiza nada
// 	if (!isOpen) return null;

// 	return (
// 		<div className="fixed inset-0 bg-gray-200 bg-opacity-60 flex items-center justify-center z-50">
// 			<div
// 				className={`bg-gray-500 p-6 rounded-lg shadow-xl w-full max-w-lg text-white ${className}`}
// 			>
// 				<div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
// 					<h2 className="text-xl font-semibold">{title}</h2>
// 					<button
// 						onClick={onClose}
// 						className="text-gray-400 hover:text-white text-2xl font-bold"
// 					>
// 						&times;
// 					</button>
// 				</div>
// 				{children}
// 			</div>
// 		</div>
// 	);
// }
// src/lib/components/Modal.tsx (ou onde quer que seu Modal esteja)

import React from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
	className?: string;
}

export function Modal({
	isOpen,
	onClose,
	children,
	title = 'Modal',
	className,
}: ModalProps) {
	if (!isOpen) return null;

	return (
		// Overlay do fundo: Fundo cinza claro semi-transparente
		<div className="fixed inset-0 bg-gray-200/60 flex items-center justify-center z-50">
			{/* Container do Modal: Fundo branco, sombra, arredondado, largura fixa e texto escuro */}
			<div
				className={`bg-white p-6 rounded-lg shadow-lg w-[400px] text-gray-800 ${className}`}
			>
				{/* Cabeçalho do Modal: Flexbox para alinhar título e botão de fechar, borda inferior sutil */}
				<div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-800">{title}</h2>
					{/* Botão de Fechar ('x'): Cor mais clara para o 'x' e negrito */}
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
						aria-label="Fechar"
					>
						&times;
					</button>
				</div>

				{children}
			</div>
		</div>
	);
}
