import { useState, useEffect, useRef } from 'react';
import { ClientCard } from '../lib/components/ClientCard';
import { api } from '../api.ts';
import { Header } from '../lib/components/Header';
import { Button } from '../lib/components/Button';
import { Modal } from '../lib/components/Modal';
import { ClientForm } from '../lib/components/ClientForm';
import { Pagination } from '../lib/components/Pagination';
import { BiRefresh } from 'react-icons/bi';

interface Client {
	id?: string;
	name: string;
	salary?: string;
	company?: string;
	email: string;
	status?: 'creating' | 'created' | 'failed';
}

export function SelectedClients() {
	const [clients, setClients] = useState<Client[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [clientsPerPage, setClientsPerPage] = useState(16);
	const [totalClients, setTotalClients] = useState(0);
	const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

	// Adicionado para edição, se você for implementar
	const [editClientData, setEditClientData] = useState<Client | undefined>(
		undefined,
	);
	const [editClientId, setEditClientId] = useState<string | undefined>(
		undefined,
	);

	const eventSourceRef = useRef<EventSource | null>(null);

	useEffect(() => {
		fetchClients();

		const sseUrl = `${
			import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
		}/events?eventType=client.created`;
		eventSourceRef.current = new EventSource(sseUrl);

		eventSourceRef.current.addEventListener('client.created', (event) => {
			try {
				const newClientData: Client = JSON.parse(event.data);
				setClients((prevClients) => {
					const existingClientIndex = prevClients.findIndex(
						(c) => c.email === newClientData.email && c.status === 'creating',
					);

					if (existingClientIndex !== -1) {
						const updatedClients = [...prevClients];
						updatedClients[existingClientIndex] = {
							...newClientData,
							status: 'created',
						};
						return updatedClients;
					} else {
						if (!prevClients.some((c) => c.id === newClientData.id)) {
							return [{ ...newClientData, status: 'created' }, ...prevClients];
						}
						return prevClients;
					}
				});
				setTotalClients((prevTotal) => prevTotal + 1);
			} catch (e) {
				console.error('Erro ao fazer parse do evento SSE:', e);
			}
		});

		eventSourceRef.current.onerror = () => {
			eventSourceRef.current?.close();
			setError('Erro de conexão com o servidor. Tentando reconectar...');
			setTimeout(() => {
				eventSourceRef.current = new EventSource(sseUrl);
			}, 5000);
		};

		return () => {
			eventSourceRef.current?.close();
		};
	}, [currentPage, clientsPerPage]);

	const fetchClients = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.get(
				`/clients?page=${currentPage}&limit=${clientsPerPage}`,
			);
			setClients(
				response.data.data.map((c: Client) => ({ ...c, status: 'created' })),
			);
			setTotalClients(response.data.total);
		} catch (err) {
			console.error('Erro ao buscar clientes:', err);
			setError('Não foi possível carregar os clientes. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const handleCreateClientSubmit = async (clientData: {
		name: string;
		salary?: string;
		company?: string;
	}) => {
		// Se estiver editando, chame a função de edição
		if (editClientId) {
			try {
				await api.patch(`/clients/${editClientId}`, clientData, {
					headers: {
						'Content-Type': 'application/json',
					},
					data: clientData,
				});
				setClients((prev) =>
					prev.map((c) =>
						c.id === editClientId
							? { ...c, ...clientData, status: 'created' }
							: c,
					),
				);
				console.log(`Cliente ${editClientId} atualizado com sucesso.`);
			} catch (err: any) {
				console.error(
					'Erro ao atualizar cliente (API):',
					err.response?.data || err.message,
				);
				setError(err.response?.data?.message || 'Falha ao atualizar cliente.');
			} finally {
				setEditClientId(undefined); // Limpa o ID de edição
				setEditClientData(undefined); // Limpa os dados de edição
				setShowCreateModal(false); // Fecha o modal
			}
			return; // Sai da função após a edição
		}

		// Se não estiver editando, procede com a criação
		const tempId = `temp-${crypto.randomUUID()}`;

		const tempClient: Client = {
			id: tempId,
			...clientData,
			status: 'creating',
		};

		setClients((prevClients) => [tempClient, ...prevClients]);
		setShowCreateModal(false);

		try {
			await api.post('/clients', clientData);
		} catch (err: any) {
			console.error(
				'Erro ao criar cliente (API):',
				err.response?.data || err.message,
			);
			setError(err.response?.data?.message || 'Falha ao criar cliente.');
			setClients((prevClients) =>
				prevClients.map((client) =>
					client.id === tempId ? { ...client, status: 'failed' } : client,
				),
			);
		}
	};

	const handleAddClientToSelection = (clientId: string) => {
		console.log(`Adicionar cliente ${clientId} à seleção.`);
	};

	const handleEditClient = (clientId: string) => {
		const clientToEdit = clients.find((c) => c.id === clientId);
		if (clientToEdit) {
			setEditClientData(clientToEdit); // Passa os dados para preencher o formulário
			setEditClientId(clientId); // Armazena o ID do cliente a ser editado
			setShowCreateModal(true); // Abre o modal de edição
		}
	};

	const confirmDelete = (client: Client) => {
		setClientToDelete(client);
	};

	const handleAlertDeleteConfirmed = () => {
		if (clientToDelete) {
			handleDeleteClient(clientToDelete.id || '');
			setClientToDelete(null);
		}
	};

	const handleDeleteClient = async (clientId: string) => {
		try {
			await api.delete(`/clients/${clientId}`);
			setClients((prevClients) =>
				prevClients.filter((client) => client.id !== clientId),
			);
			setTotalClients((prevTotal) => prevTotal - 1);
			console.log(`Cliente ${clientId} excluído com sucesso.`);
		} catch (err) {
			console.error('Erro ao excluir cliente:', err);
			setError('Não foi possível excluir o cliente. Tente novamente.');
		}
	};

	return (
		<div className="min-h-screen bg-[#F0F2F5] text-gray-800 font-sans">
			{' '}
			{/* Fundo mais claro e texto padrão */}
			<Header userName={localStorage.getItem('userName') || 'Usuário'} />
			<div className="container mx-auto p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-700">
						{' '}
						{/* Cor do texto ajustada */}
						{totalClients} clientes encontrados:
					</h2>
					<div className="flex items-center space-x-2 text-gray-600">
						{' '}
						{/* Cor do texto ajustada */}
						<span>Clientes por página:</span>
						<select
							className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800" // Cores de fundo e borda ajustadas
							value={clientsPerPage}
							onChange={(e) => setClientsPerPage(Number(e.target.value))}
						>
							<option value="16">16</option>
							<option value="32">32</option>
							<option value="50">50</option>
						</select>
					</div>
				</div>

				{error && (
					<div
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" // Cores de erro mais suaves
						role="alert"
					>
						<span className="block sm:inline">
							{error}
							<BiRefresh
								onClick={fetchClients}
								className="inline-block ml-2 text-xl text-red-500 cursor-pointer"
							/>
						</span>
					</div>
				)}

				{loading ? (
					<p className="text-center text-gray-500">Carregando clientes...</p> // Cor de carregamento ajustada
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
							{clients.map((client) => (
								<ClientCard
									key={client.id || client.email}
									id={client.id}
									name={client.name}
									salary={client.salary?.toString() || ''}
									company={client.company?.toString() || ''}
									status={client.status}
									onAdd={() =>
										client.id && handleAddClientToSelection(client.id)
									}
									onEdit={() => client.id && handleEditClient(client.id)}
									onDelete={() => client.id && confirmDelete(client)}
								/>
							))}
						</div>

						<div className="text-center mb-8 w-full">
							{/* O botão 'Criar Cliente' deve estar na página e não fixo no bottom */}
							<div className="text-center mb-8">
								{' '}
								{/* Removido position-fixed e bottom-0 */}
								<Button
									onClick={() => {
										setEditClientData(undefined); // Garante que não está em modo de edição
										setEditClientId(undefined);
										setShowCreateModal(true);
									}}
									className="border-3 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-colors duration-200 cursor-pointer px-8 py-3 text-lg font-medium w-full rounded-md" // Adicionado rounded-md
								>
									Criar cliente
								</Button>
							</div>

							<Pagination
								currentPage={currentPage}
								totalPages={Math.ceil(totalClients / clientsPerPage)}
								onPageChange={setCurrentPage}
							/>
						</div>
					</>
				)}
			</div>
			<Modal
				isOpen={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				title={editClientId ? 'Editar Cliente' : 'Criar cliente:'} // Título dinâmico
			>
				<ClientForm
					onSubmit={handleCreateClientSubmit}
					onCancel={() => setShowCreateModal(false)}
					initialData={editClientData} // Passa os dados para preencher o formulário
				/>
			</Modal>
			{clientToDelete && (
				<div className="fixed inset-0 bg-gray-200/60  flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded shadow-lg">
						<h2 className="text-xl font-bold mb-4">Excluir cliente:</h2>

						<p className="mb-6">
							Você está prestes a excluir o cliente:{' '}
							<b>{clientToDelete.name}</b>
						</p>
						<div className="flex justify-center space-x-4">
							<button
								onClick={() => setClientToDelete(null)}
								className="px-4 py-2 bg-gray-300 rounded"
							>
								Cancelar
							</button>
							<button
								onClick={handleAlertDeleteConfirmed}
								className="px-4 py-2 bg-[#FF6B00] text-white rounded"
							>
								Sim, excluir
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
