import { Button } from './Button';
import {
	BiTrash,
	BiPencil,
	BiPlus,
	BiLoaderAlt,
	BiErrorCircle,
} from 'react-icons/bi'; // Importe BiLoaderAlt e BiErrorCircle

interface ClientCardProps {
	id?: string; // Tornar opcional para cards em criação
	name: string;
	salary: string; // Ou number, dependendo da sua tipagem
	company: string;
	status?: 'creating' | 'created' | 'failed'; // Novo prop de status
	onAdd?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
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

export function ClientCard({
	name,
	salary,
	company,
	status, // Recebe o novo prop de status
	onAdd,
	onEdit,
	onDelete,
}: ClientCardProps) {
	const isCreating = status === 'creating';
	const isFailed = status === 'failed';
	// Se o card está em criação ou falhou, os botões devem ser desabilitados
	const disableActions = isCreating || isFailed;

	return (
		<div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col relative">
			{/* Overlay para "Criando..." */}
			{isCreating && (
				<div className="absolute inset-0 bg-gray-300 bg-blend-saturation bg-opacity-75 flex flex-col items-center justify-center rounded-lg z-10 p-4">
					<BiLoaderAlt className="animate-spin text-gray-600 text-5xl mb-3" />
					<span className="text-gray-500 text-lg font-semibold text-center">
						Criando...
					</span>
					<p className="text-gray-500 text-sm text-center mt-1">
						Aguarde a confirmação.
					</p>
				</div>
			)}

			{/* Overlay para "Falha na criação" */}
			{isFailed && (
				<div className="absolute inset-0 bg-red-800 bg-opacity-75 flex flex-col items-center justify-center rounded-lg z-10 p-4">
					<BiErrorCircle className="text-white text-5xl mb-3" />
					<span className="text-white text-lg font-semibold text-center">
						Falha na criação!
					</span>
					<p className="text-gray-200 text-sm text-center mt-1">
						Verifique os dados ou tente novamente.
					</p>
				</div>
			)}

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
					Empresa: {company}
				</p>
			</div>
			<div className="mt-auto flex justify-between space-x-2">
				{onAdd && (
					<Button
						onClick={onAdd}
						className="p-3 text-gray-700 hover:bg-gray-300 rounded-full text-2xl"
						aria-label="Adicionar"
						disabled={disableActions} // Desabilita o botão
					>
						<BiPlus />
					</Button>
				)}
				{onEdit && (
					<Button
						onClick={onEdit}
						className="p-3 text-gray-700 hover:bg-gray-300 rounded-full text-2xl"
						aria-label="Editar"
						disabled={disableActions} // Desabilita o botão
					>
						<BiPencil />
					</Button>
				)}
				{onDelete && (
					<Button
						onClick={onDelete}
						className="p-3 text-red-400 hover:bg-gray-300 rounded-full text-2xl"
						aria-label="Excluir"
						disabled={disableActions} // Desabilita o botão
					>
						<BiTrash />
					</Button>
				)}
			</div>
		</div>
	);
}
