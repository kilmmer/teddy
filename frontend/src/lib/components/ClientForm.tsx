import React, { useState, useEffect } from 'react';

interface ClientFormProps {
	onSubmit: (data: { name: string; salary?: string; company?: string }) => void;
	onCancel: () => void;
	initialData?: {
		name: string;
		salary?: string;
		company?: string;
		id?: string;
	};
	isLoading?: boolean;
}

export function ClientForm({
	onSubmit,
	onCancel,
	initialData,
	isLoading,
}: ClientFormProps) {
	const [name, setName] = useState(initialData?.name || '');

	const [salaryFormatted, setSalaryFormatted] = useState('');
	const [companyFormatted, setCompanyFormatted] = useState('');

	// Estados para os valores numéricos que serão enviados para a API
	// Agora `null` é usado para "vazio", e `undefined` é o tipo padrão
	const [salaryNumeric, setSalaryNumeric] = useState<number | null>(null);
	const [companyNumeric, setCompanyNumeric] = useState<number | null>(null);

	const [errors, setErrors] = useState({
		name: '',
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
