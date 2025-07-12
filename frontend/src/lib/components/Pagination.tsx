// import { Button } from './Button'; // Certifique-se de que o caminho está correto

// interface PaginationProps {
// 	currentPage: number;
// 	totalPages: number;
// 	onPageChange: (page: number) => void;
// }

// export function Pagination({
// 	currentPage,
// 	totalPages,
// 	onPageChange,
// }: PaginationProps) {
// 	const pageNumbers = [];
// 	for (let i = 1; i <= totalPages; i++) {
// 		pageNumbers.push(i);
// 	}

// 	return (
// 		<div className="flex justify-center space-x-2 py-4">
// 			{/* <Button
// 				onClick={() => onPageChange(currentPage - 1)}
// 				disabled={currentPage === 1}
// 				className="bg-gray-700 hover:bg-gray-600 text-gray-300 disabled:opacity-50"
// 			>
// 				Anterior
// 			</Button> */}
// 			{pageNumbers.map((number) => (
// 				<Button
// 					key={number}
// 					onClick={() => onPageChange(number)}
// 					className={`
// 						'px-3 py-1 rounded-md',
// 						${
// 							currentPage === number
// 								? 'bg-[#FF6B00] text-white' // Página ativa
// 								: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
// 						}
// 					`}
// 				>
// 					{number}
// 				</Button>
// 			))}
// 			{/* <Button
// 				onClick={() => onPageChange(currentPage + 1)}
// 				disabled={currentPage === totalPages}
// 				className="bg-gray-700 hover:bg-gray-600 text-gray-300 disabled:opacity-50"
// 			>
// 				Próximo
// 			</Button> */}
// 		</div>
// 	);
// }

import React from 'react';
import { Button } from './Button'; // Certifique-se de que o caminho está correto

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	const getPageNumbers = () => {
		const pageNumbers: (number | string)[] = [];
		const maxPagesToShow = 5; // Número máximo de botões de página visíveis (ex: 1, ..., 3, 4, 5, ..., 12)
		const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
		const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

		if (totalPages <= maxPagesToShow + 2) {
			// Se o total for pequeno, mostra todas as páginas
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			// Sempre inclui a primeira página
			pageNumbers.push(1);

			// Adiciona reticências se a página 1 não estiver próxima do início do bloco visível
			if (currentPage > Math.floor(maxPagesToShow / 2) + 1) {
				pageNumbers.push('...');
			}

			// Adiciona as páginas ao redor da página atual
			for (let i = startPage; i <= endPage; i++) {
				if (i !== 1 && i !== totalPages) {
					// Evita duplicar 1 e totalPages
					pageNumbers.push(i);
				}
			}

			// Garante que a página atual e suas vizinhas estejam incluídas
			const pagesAroundCurrent = [];
			for (let i = currentPage - 1; i <= currentPage + 1; i++) {
				if (i > 1 && i < totalPages) {
					// Não inclui 1 ou totalPages se já estiverem lá
					pagesAroundCurrent.push(i);
				}
			}
			// Adiciona as páginas ao redor da página atual, filtrando duplicatas
			pagesAroundCurrent.forEach((p) => {
				if (!pageNumbers.includes(p)) {
					pageNumbers.push(p);
				}
			});

			// Adiciona reticências se a última página não estiver próxima do final do bloco visível
			if (currentPage < totalPages - Math.floor(maxPagesToShow / 2)) {
				pageNumbers.push('...');
			}

			// Sempre inclui a última página, se não for a primeira
			if (totalPages > 1) {
				pageNumbers.push(totalPages);
			}

			// Remove duplicatas e ordena (necessário devido à lógica de adição)
			const uniquePageNumbers = Array.from(new Set(pageNumbers));
			pageNumbers.splice(
				0,
				pageNumbers.length,
				...uniquePageNumbers.sort((a, b) => {
					if (typeof a === 'string') return 1; // '...' vai para o final
					if (typeof b === 'string') return -1; // '...' vai para o final
					return (a as number) - (b as number);
				}),
			);

			// Lógica para compactar "..." e números adjacentes:
			// Se tiver [1, ..., 2, 3] vira [1, 2, 3]
			// Se tiver [3, ..., 5, 6] vira [3, 4, 5, 6]
			const finalPages: (number | string)[] = [];
			for (let i = 0; i < pageNumbers.length; i++) {
				const current = pageNumbers[i];
				const next = pageNumbers[i + 1];

				if (
					current === '...' &&
					typeof next === 'number' &&
					next === (finalPages[finalPages.length - 1] as number) + 1
				) {
					// Remove o '...' se ele for adjacente a um número que já está na lista final
					continue;
				}
				finalPages.push(current);
			}
			pageNumbers.splice(0, pageNumbers.length, ...finalPages);
		}

		// Nova lógica para garantir que há pelo menos 5 botões visíveis, incluindo a página atual
		const visiblePages: (number | string)[] = [];
		const numButtons = 5; // Total de botões numéricos a serem exibidos (incluindo a página atual)

		if (totalPages <= numButtons) {
			for (let i = 1; i <= totalPages; i++) {
				visiblePages.push(i);
			}
		} else {
			// Sempre adiciona a primeira página
			visiblePages.push(1);

			let pagesAdded = 1; // Contabiliza a primeira página

			// Determina o intervalo central
			let start = Math.max(2, currentPage - Math.floor((numButtons - 3) / 2));
			let end = Math.min(totalPages - 1, start + (numButtons - 3) - 1);

			// Ajusta o início e o fim se estiver muito perto do fim
			if (end - start + 1 < numButtons - 3) {
				start = Math.max(2, totalPages - (numButtons - 1));
			}
			// Ajusta o início e o fim se estiver muito perto do começo
			if (start < 2) {
				end = Math.min(totalPages - 1, numButtons - 2);
			}

			// Adiciona "..." se necessário após a primeira página
			if (start > 2) {
				visiblePages.push('...');
			}

			// Adiciona as páginas intermediárias
			for (let i = start; i <= end; i++) {
				visiblePages.push(i);
				pagesAdded++;
			}

			// Adiciona "..." se necessário antes da última página
			if (end < totalPages - 1) {
				visiblePages.push('...');
			}

			// Sempre adiciona a última página (se houver mais de uma)
			if (totalPages > 1 && !visiblePages.includes(totalPages)) {
				visiblePages.push(totalPages);
			}
			// Filtra duplicatas e ordena para garantir a exibição correta
			const finalSortedPages = Array.from(new Set(visiblePages)).sort(
				(a, b) => {
					if (typeof a === 'string') return 1; // '...' vai para o final na ordenação inicial
					if (typeof b === 'string') return -1; // '...' vai para o final na ordenação inicial
					return (a as number) - (b as number);
				},
			);

			// Passa por uma nova filtragem para garantir que '...' não esteja adjacente a números
			const result: (number | string)[] = [];
			for (let i = 0; i < finalSortedPages.length; i++) {
				const current = finalSortedPages[i];
				if (current === '...') {
					// Verifica se o '...' é realmente necessário
					const prevNum = result[result.length - 1];
					const nextNum = finalSortedPages[i + 1];
					if (
						typeof prevNum === 'number' &&
						typeof nextNum === 'number' &&
						nextNum === prevNum + 1
					) {
						// Se o número anterior e o próximo forem sequenciais, não precisa de '...'
						continue;
					}
				}
				result.push(current);
			}
			return result;
		}

		return visiblePages;
	};

	const displayedPageNumbers = getPageNumbers();

	return (
		<div className="flex justify-center space-x-2 py-4">
			{displayedPageNumbers.map((item, index) =>
				typeof item === 'string' ? (
					<span key={index} className="px-3 py-1 text-gray-800">
						{item} {/* Renderiza as reticências */}
					</span>
				) : (
					<Button
						key={item}
						onClick={() => onPageChange(item)}
						className={`
                            px-4 py-2 rounded-md transition-colors duration-200 ease-in-out
                            ${
															currentPage === item
																? 'bg-[#FF6B00] text-white font-bold' // Página ativa: fundo laranja, texto branco, negrito
																: 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-300' // Outras páginas: fundo branco, texto preto, borda
														}
                        `}
					>
						{item}
					</Button>
				),
			)}
		</div>
	);
}
