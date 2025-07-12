// // // src/lib/components/ClientForm.tsx
// // import React, { useState, useEffect } from 'react';
// // import { Input } from './Input';
// // import { Button } from './Button';

// // interface ClientFormProps {
// // 	initialData?: {
// // 		name: string;
// // 		email: string;
// // 		salary?: string;
// // 		company?: string;
// // 		id?: number;
// // 	};
// // 	onSubmit: (data: {
// // 		name: string;
// // 		email: string;
// // 		salary?: string;
// // 		company?: string;
// // 	}) => void;
// // 	onCancel?: () => void;
// // 	isLoading?: boolean;
// // }

// // const ClientForm: React.FC<ClientFormProps> = ({
// // 	initialData,
// // 	onSubmit,
// // 	onCancel,
// // 	isLoading,
// // }) => {
// // 	const [name, setName] = useState(initialData?.name || '');
// // 	const [email, setEmail] = useState(initialData?.email || '');
// // 	const [salary, setSalary] = useState(initialData?.salary || ''); // Adicione salário
// // 	const [company, setCompany] = useState(initialData?.company || ''); // Adicione empresa
// // 	const [errors, setErrors] = useState({
// // 		name: '',
// // 		email: '',
// // 		salary: '',
// // 		company: '',
// // 	});

// // 	useEffect(() => {
// // 		if (initialData) {
// // 			setName(initialData.name);
// // 			setEmail(initialData.email);
// // 			setSalary(initialData.salary || '');
// // 			setCompany(initialData.company || '');
// // 		}
// // 	}, [initialData]);

// // 	const validate = () => {
// // 		let isValid = true;
// // 		const newErrors = { name: '', email: '', salary: '', company: '' };

// // 		if (!name.trim()) {
// // 			newErrors.name = 'O nome é obrigatório.';
// // 			isValid = false;
// // 		}
// // 		if (!email.trim()) {
// // 			newErrors.email = 'O e-mail é obrigatório.';
// // 			isValid = false;
// // 		} else if (!/\S+@\S+\.\S+/.test(email)) {
// // 			newErrors.email = 'E-mail inválido.';
// // 			isValid = false;
// // 		}
// // 		if (!salary.trim()) {
// // 			newErrors.salary = 'O salário é obrigatório.';
// // 			isValid = false;
// // 		}
// // 		if (!company.trim()) {
// // 			newErrors.company = 'A empresa é obrigatória.';
// // 			isValid = false;
// // 		}

// // 		setErrors(newErrors);
// // 		return isValid;
// // 	};

// // 	const handleSubmit = (e: React.FormEvent) => {
// // 		e.preventDefault();
// // 		if (validate()) {
// // 			onSubmit({ name, email, salary, company });
// // 		}
// // 	};

// // 	return (
// // 		<form onSubmit={handleSubmit} className="p-4">
// // 			<div className="mb-4">
// // 				<label
// // 					htmlFor="name"
// // 					className="block text-sm font-medium text-gray-300 mb-1"
// // 				>
// // 					Nome
// // 				</label>
// // 				<Input
// // 					id="name"
// // 					type="text"
// // 					placeholder="Nome do Cliente"
// // 					value={name}
// // 					onChange={(e) => setName(e.target.value)}
// // 					className="w-full bg-gray-700 text-white border-gray-600 focus:ring-[#FF6B00]"
// // 				/>
// // 				{errors.name && (
// // 					<p className="text-red-400 text-xs mt-1">{errors.name}</p>
// // 				)}
// // 			</div>
// // 			<div className="mb-4">
// // 				<label
// // 					htmlFor="email"
// // 					className="block text-sm font-medium text-gray-300 mb-1"
// // 				>
// // 					Email
// // 				</label>
// // 				<Input
// // 					id="email"
// // 					type="email"
// // 					placeholder="email@example.com"
// // 					value={email}
// // 					onChange={(e) => setEmail(e.target.value)}
// // 					className="w-full bg-gray-700 text-white border-gray-600 focus:ring-[#FF6B00]"
// // 				/>
// // 				{errors.email && (
// // 					<p className="text-red-400 text-xs mt-1">{errors.email}</p>
// // 				)}
// // 			</div>
// // 			<div className="mb-4">
// // 				<label
// // 					htmlFor="salary"
// // 					className="block text-sm font-medium text-gray-300 mb-1"
// // 				>
// // 					Salário
// // 				</label>
// // 				<Input
// // 					id="salary"
// // 					type="text"
// // 					placeholder="R$ 3.500,00"
// // 					value={salary}
// // 					onChange={(e) => setSalary(e.target.value)}
// // 					className="w-full bg-gray-700 text-white border-gray-600 focus:ring-[#FF6B00]"
// // 				/>
// // 				{errors.salary && (
// // 					<p className="text-red-400 text-xs mt-1">{errors.salary}</p>
// // 				)}
// // 			</div>
// // 			<div className="mb-4">
// // 				<label
// // 					htmlFor="company"
// // 					className="block text-sm font-medium text-gray-300 mb-1"
// // 				>
// // 					Empresa
// // 				</label>
// // 				<Input
// // 					id="company"
// // 					type="text"
// // 					placeholder="Nome da Empresa"
// // 					value={company}
// // 					onChange={(e) => setCompany(e.target.value)}
// // 					className="w-full bg-gray-700 text-white border-gray-600 focus:ring-[#FF6B00]"
// // 				/>
// // 				{errors.company && (
// // 					<p className="text-red-400 text-xs mt-1">{errors.company}</p>
// // 				)}
// // 			</div>
// // 			<div className="flex justify-end space-x-2">
// // 				{onCancel && (
// // 					<Button
// // 						type="button"
// // 						onClick={onCancel}
// // 						className="bg-gray-600 hover:bg-gray-700 text-white"
// // 					>
// // 						Cancelar
// // 					</Button>
// // 				)}
// // 				<Button
// // 					type="submit"
// // 					disabled={isLoading}
// // 					className="bg-[#FF6B00] hover:bg-orange-700 text-white"
// // 				>
// // 					{isLoading
// // 						? 'Salvando...'
// // 						: initialData
// // 						? 'Atualizar Cliente'
// // 						: 'Adicionar Cliente'}
// // 				</Button>
// // 			</div>
// // 		</form>
// // 	);
// // };

// // export default ClientForm;

// // src/lib/components/ClientForm.tsx (exemplo de como poderia ser)

// import React, { useState } from 'react';

// interface ClientFormProps {
// 	onSubmit: (data: {
// 		name: string;
// 		email: string;
// 		salary?: string;
// 		company?: string;
// 	}) => void;
// 	onCancel: () => void;
// 	initialData?: {
// 		name: string;
// 		email: string;
// 		salary?: string;
// 		company?: string;
// 	}; // Para edição
// }

// export function ClientForm({
// 	onSubmit,
// 	onCancel,
// 	initialData,
// }: ClientFormProps) {
// 	const [name, setName] = useState(initialData?.name || '');
// 	const [salary, setSalary] = useState(initialData?.salary || '');
// 	const [company, setCompany] = useState(initialData?.company || '');
// 	const [email, setEmail] = useState(initialData?.email || ''); // Adicionado email, se for necessário

// 	const handleSubmit = (e: React.FormEvent) => {
// 		e.preventDefault();
// 		onSubmit({ name, salary, company, email }); // Passe o email também, se usado
// 	};

// 	return (
// 		<form onSubmit={handleSubmit} className="space-y-4">
// 			<div>
// 				{/* Input de Nome */}
// 				<input
// 					type="text"
// 					placeholder="Digite o nome:"
// 					value={name}
// 					onChange={(e) => setName(e.target.value)}
// 					className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
// 					required
// 				/>
// 			</div>
// 			<div>
// 				{/* Input de Salário */}
// 				<input
// 					type="number"
// 					placeholder="Digite o salário:"
// 					value={salary}
// 					onChange={(e) => setSalary(e.target.value)}
// 					className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
// 				/>
// 			</div>
// 			<div>
// 				{/* Input de Valor da Empresa */}
// 				<input
// 					type="number"
// 					placeholder="Digite o valor da empresa:"
// 					value={company}
// 					onChange={(e) => setCompany(e.target.value)}
// 					className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
// 				/>
// 			</div>

// 			<div className="pt-2">
// 				{' '}
// 				{/* Padding top para separar do último input */}
// 				<button
// 					type="submit"
// 					className="w-full bg-[#FF6B00] hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition duration-200 ease-in-out"
// 				>
// 					Criar cliente
// 				</button>
// 			</div>
// 			{/* Opcional: botão de cancelar se a lógica do modal não fechar sozinho */}
// 			{/* <button type="button" onClick={onCancel} className="...">Cancelar</button> */}
// 		</form>
// 	);
// }
// src/lib/components/ClientForm.tsx
import React, { useState, useEffect } from 'react';
// Importe Input e Button se não estiverem no mesmo arquivo
// import { Input } from './Input';
// import { Button } from './Button';

interface ClientFormProps {
	onSubmit: (data: {
		name: string;
		// email: string; // Removido: se não há input de email, não precisa aqui
		salary?: string;
		company?: string;
	}) => void;
	onCancel: () => void;
	initialData?: {
		name: string;
		// email: string; // Removido
		salary?: string;
		company?: string;
		id?: number;
	};
	isLoading?: boolean; // Adicionei de volta, pois é uma boa prática para o botão
}

export function ClientForm({
	onSubmit,
	onCancel,
	initialData,
	isLoading, // Destructuring da prop isLoading
}: ClientFormProps) {
	const [name, setName] = useState(initialData?.name || '');

	// Estados para os valores formatados no input
	const [salaryFormatted, setSalaryFormatted] = useState('');
	const [companyFormatted, setCompanyFormatted] = useState('');

	// Estados para os valores numéricos que serão enviados para a API
	// Agora `null` é usado para "vazio", e `undefined` é o tipo padrão
	const [salaryNumeric, setSalaryNumeric] = useState<number | null>(null);
	const [companyNumeric, setCompanyNumeric] = useState<number | null>(null);

	const [errors, setErrors] = useState({
		name: '',
		// email: '', // Removido
		salary: '',
		company: '',
	});

	useEffect(() => {
		if (initialData) {
			setName(initialData.name);

			// Carrega e formata Salário
			if (initialData.salary) {
				const numericSalary = parseOnlyDigits(initialData.salary);
				setSalaryNumeric(numericSalary);
				setSalaryFormatted(formatValueWithPrefix(numericSalary, 'R$ '));
			} else {
				setSalaryNumeric(null);
				setSalaryFormatted('');
			}

			// Carrega e formata Valor da Empresa
			if (initialData.company) {
				const numericCompany = parseOnlyDigits(initialData.company);
				setCompanyNumeric(numericCompany);
				setCompanyFormatted(formatValueWithPrefix(numericCompany, 'R$ '));
			} else {
				setCompanyNumeric(null);
				setCompanyFormatted('');
			}
		}
	}, [initialData]);

	// --- Funções de Formatação e Parse ---

	/**
	 * Remove todos os caracteres não numéricos de uma string e retorna um número inteiro.
	 * Trata `undefined`, `null` ou strings vazias retornando `null`.
	 * @param value O valor a ser parseado (string, number, undefined, null).
	 * @returns O número inteiro ou `null`.
	 */
	const parseOnlyDigits = (
		value: string | number | undefined | null,
	): number | null => {
		if (value === undefined || value === null || value === '') {
			return null;
		}
		const stringValue = typeof value === 'number' ? String(value) : value;
		// Remove tudo que não é dígito. Isso limpa "R$", ".", "," etc.
		const cleaned = stringValue.replace(/[^\d]/g, '');
		const num = parseInt(cleaned, 10);
		return isNaN(num) ? null : num;
	};

	/**
	 * Formata um número inteiro com separador de milhar e um prefixo opcional.
	 * Ex: formatValueWithPrefix(12345, 'R$ ') => "R$ 12.345"
	 * @param value O número inteiro a ser formatado.
	 * @param prefix O prefixo a ser adicionado (ex: 'R$ ').
	 * @returns A string formatada.
	 */
	const formatValueWithPrefix = (
		value: number | null,
		prefix: string = '',
	): string => {
		if (value === null || isNaN(value)) {
			return '';
		}
		// Formata o número com separador de milhar (ponto para pt-BR) e sem decimais
		const formatted = new Intl.NumberFormat('pt-BR', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);
		return `${prefix}${formatted}`;
	};

	// --- Handlers de Mudança Genéricos ---

	const handleNumericInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setFormatted: React.Dispatch<React.SetStateAction<string>>,
		setNumeric: React.Dispatch<React.SetStateAction<number | null>>,
		prefix: string = '',
	) => {
		const inputVal = e.target.value;
		const numericVal = parseOnlyDigits(inputVal); // Extrai apenas os dígitos

		setNumeric(numericVal); // Atualiza o estado numérico
		setFormatted(formatValueWithPrefix(numericVal, prefix)); // Atualiza o estado formatado para exibição
	};

	// --- Handlers Específicos ---

	const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleNumericInputChange(e, setSalaryFormatted, setSalaryNumeric, 'R$ ');
	};

	const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleNumericInputChange(e, setCompanyFormatted, setCompanyNumeric, 'R$ ');
	};

	// --- Validação ---
	const validate = () => {
		let isValid = true;
		const newErrors = { name: '', salary: '', company: '' }; // Removido 'email'

		if (!name.trim()) {
			newErrors.name = 'O nome é obrigatório.';
			isValid = false;
		}

		if (salaryNumeric === null) {
			// Agora verifica se é null
			newErrors.salary = 'O salário é obrigatório.';
			isValid = false;
		}
		if (companyNumeric === null) {
			// Agora verifica se é null
			newErrors.company = 'O valor da empresa é obrigatório.';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validate()) {
			onSubmit({
				name,
				// email: initialData?.email, // Removido, ou trate como opcional se precisar persistir
				salary: salaryNumeric !== null ? String(salaryNumeric) : undefined,
				company: companyNumeric !== null ? String(companyNumeric) : undefined,
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-gray-800 mb-1"
				>
					Nome
				</label>
				<input
					id="name"
					type="text"
					placeholder="Digite o nome:"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
					required
				/>
				{errors.name && (
					<p className="text-red-600 text-xs mt-1">{errors.name}</p>
				)}
			</div>

			{/* O campo de e-mail foi removido de acordo com a sua indicação.
                Se precisar dele novamente, adicione-o de volta na interface,
                estados (email, setEmail), e no JSX, junto com sua validação. */}

			<div>
				<label
					htmlFor="salary"
					className="block text-sm font-medium text-gray-800 mb-1"
				>
					Salário
				</label>
				<input
					id="salary"
					type="text" // Mantém como text
					placeholder="R$ 0" // Placeholder mais simples
					value={salaryFormatted}
					onChange={handleSalaryChange}
					className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
				/>
				{errors.salary && (
					<p className="text-red-600 text-xs mt-1">{errors.salary}</p>
				)}
			</div>
			<div>
				<label
					htmlFor="company"
					className="block text-sm font-medium text-gray-800 mb-1"
				>
					Valor da Empresa
				</label>
				<input
					id="company"
					type="text" // Mantém como text
					placeholder="R$ 0" // Placeholder mais simples
					value={companyFormatted}
					onChange={handleCompanyChange}
					className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
				/>
				{errors.company && (
					<p className="text-red-600 text-xs mt-1">{errors.company}</p>
				)}
			</div>

			<div className="flex justify-end space-x-2 pt-2">
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out"
					>
						Cancelar
					</button>
				)}
				<button
					type="submit"
					disabled={isLoading}
					className="bg-[#FF6B00] hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out"
				>
					{isLoading
						? 'Salvando...'
						: initialData
						? 'Atualizar Cliente'
						: 'Criar cliente'}
				</button>
			</div>
		</form>
	);
}
