import { Header } from '../lib/components/Header';
import { Link } from 'react-router-dom'; // Para permitir a navegação de volta

// Importe o hook do contexto
import { useSelectedClients } from '../contexts/selectedClients.context';

import { ClientCardSelected } from '../lib/components/ClientCardSelected';
import { Button } from '../lib/components/Button';

// A interface SelectedClient deve ser a mesma definida no seu contexto
interface SelectedClient {
	id: string;
	name: string;
	company?: string;
	salary?: string;
}

export function SelectedClients() {
	// Consuma os clientes selecionados do contexto
	const { selectedClients, removeClientFromSelection } = useSelectedClients();

	return (
		<div className="min-h-screen bg-[#F0F2F5] text-gray-800 font-sans">
			<Header userName={localStorage.getItem('userName') || 'Usuário'} />
			<div className="container mx-auto p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-700">
						Clientes selecionados:
					</h2>
					{/* Botão para voltar à tela de todos os clientes */}
					<Link to="/" className="text-[#FF6B00] hover:underline">
						Voltar para Todos os Clientes
					</Link>
				</div>

				{selectedClients.length === 0 ? (
					<p className="text-center text-gray-500 text-lg py-10">
						Nenhum cliente selecionado ainda. Vá para a tela "Clientes" e use o
						botão '+' nas cartas para adicioná-los.
					</p>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
							{selectedClients.map((client: SelectedClient) => (
								<ClientCardSelected
									key={client.id}
									id={client.id}
									name={client.name}
									salary={client.salary || ''}
									company={client.company || ''}
									onDelete={() => removeClientFromSelection(client.id)}
								/>
							))}
						</div>
						<div className="text-center mb-8 w-full">
							<div className="text-center mb-8">
								<Button
									onClick={() => {
										// Limpa a seleção de clientes
										selectedClients.forEach((client) =>
											removeClientFromSelection(client.id),
										);
									}}
									className="border-3 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-colors duration-200 cursor-pointer px-8 py-3 text-lg font-medium w-full rounded-md"
								>
									Limpar clientes selecionados
								</Button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
