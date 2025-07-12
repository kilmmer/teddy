import { Button } from './Button';
import { BiMinus } from 'react-icons/bi'; // Importe BiLoaderAlt e BiErrorCircle

interface ClientCardSelectedProps {
	id: string;
	name: string;
	salary: string;
	company: string;
	onDelete: () => void;
}

const formatSalary = (salary: string) => {
	// Garante que o salário é um número antes de formatar
	const numericSalary = parseFloat(
		salary.replace(/[^\d,]/g, '').replace(',', '.'),
	);
	if (isNaN(numericSalary)) {
		return 'R$ 0,00'; // Valor padrão ou erro se não for um número válido
	}
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(numericSalary);
};

export function ClientCardSelected({
	name,
	salary,
	company,
	onDelete,
}: ClientCardSelectedProps) {
	return (
		<div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col relative">
			<div className="mb-2 flex-grow">
				{' '}
				{/* flex-grow para garantir que o conteúdo empurre os botões para baixo */}
				<h3 className="text-xl font-semibold text-center mb-3 text-gray-800">
					{name}
				</h3>
				<p className="text-gray-600 text-sm text-center mb-3">
					Salário: {formatSalary(salary)}
				</p>
				<p className="text-gray-600 text-sm text-center mb-3">
					Empresa: {formatSalary(company)}
				</p>
			</div>
			<div className="mt-auto flex justify-end space-x-2">
				{onDelete && (
					<Button
						onClick={onDelete}
						className="p-3 text-red-400 hover:bg-gray-300 rounded-full text-2xl"
						aria-label="Excluir"
					>
						<BiMinus />
					</Button>
				)}
			</div>
		</div>
	);
}
