import { useState, useEffect, useRef, useCallback } from 'react';
import { ClientCard } from '../lib/components/ClientCard';
import { api } from '../api.ts';
import { Header } from '../lib/components/Header';
import { Button } from '../lib/components/Button';
import { Modal } from '../lib/components/Modal';
import { ClientForm } from '../lib/components/ClientForm';
import { Pagination } from '../lib/components/Pagination';
import { BiRefresh } from 'react-icons/bi';

import { useSelectedClients } from '../contexts/selectedClients.context';

interface Client {
	id: string;
	name: string;
	salary?: string;
	company?: string;
	status?: 'creating' | 'created' | 'failed';
}

export function Clients() {
	const [clients, setClients] = useState<Client[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [clientsPerPage, setClientsPerPage] = useState(16);
	const [totalClients, setTotalClients] = useState(0);
	const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

	const [editClientData, setEditClientData] = useState<
		| {
				name: string;
				salary?: string;
				company?: string;
				id?: string;
		  }
		| undefined
	>(undefined);
	const [editClientId, setEditClientId] = useState<string | undefined>(
		undefined,
	);

	const eventSourceRef = useRef<EventSource | null>(null);

	// Consumindo o contexto
	const { addClientToSelection, removeClientFromSelection, isClientSelected } =
		useSelectedClients();

	const fetchClients = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.get(
				`/clients?page=${currentPage}&limit=${clientsPerPage}`,
			);
			setClients(
				response.data.data.map((c: Client) => ({
					...c,
					id: String(c.id),
					status: 'created',
				})),
			);
			setTotalClients(response.data.total);
		} catch (err) {
			console.error('Erro ao buscar clientes:', err);
			setError('Não foi possível carregar os clientes. Tente novamente.');
		} finally {
			setLoading(false);
		}
	}, [currentPage, clientsPerPage]);

	useEffect(() => {
		fetchClients();

		const sseUrl = `${
			import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
		}/events?eventType=client.created`;

		const setupEventSource = () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
			eventSourceRef.current = new EventSource(sseUrl);

			eventSourceRef.current.addEventListener('client.created', () => {
				try {
					// const newClientData: Client = JSON.parse(event.data);
					fetchClients(); // Recarrega a lista de clientes após receber o evento
					// setClients((prevClients) => {
					// 	const updatedClient: Client = {
					// 		...newClientData,
					// 		id: String(newClientData.id),
					// 		status: 'created',
					// 	};

					// 	const existingClientIndex = prevClients.findIndex(
					// 		(c) =>
					// 			(c.id && c.id === updatedClient.id) || c.status === 'creating',
					// 	);

					// 	if (existingClientIndex !== -1) {
					// 		const updatedClients = [...prevClients];
					// 		updatedClients[existingClientIndex] = updatedClient;
					// 		return updatedClients;
					// 	} else {
					// 		if (!prevClients.some((c) => c.id === updatedClient.id)) {
					// 			return [updatedClient, ...prevClients];
					// 		}
					// 		return prevClients;
					// 	}
					// });
				} catch (e) {
					console.error('Erro ao fazer parse do evento SSE:', e);
				}
			});

			eventSourceRef.current.onerror = (e) => {
				console.error('Erro no EventSource:', e);
				eventSourceRef.current?.close();
				setError('Erro de conexão com o servidor. Tentando reconectar...');
				setTimeout(setupEventSource, 5000);
			};
		};

		setupEventSource();

		return () => {
			eventSourceRef.current?.close();
		};
	}, [fetchClients]);

	const handleCreateClientSubmit = async (clientData: {
		name: string;
		salary?: string;
		company?: string;
	}) => {
		if (editClientId !== undefined) {
			try {
				await api.patch(`/clients/${editClientId}`, clientData);
				setClients((prev) =>
					prev.map((c) =>
						c.id === editClientId
							? { ...c, ...clientData, status: 'created' }
							: c,
					),
				);
			} catch (err: any) {
				console.error(
					'Erro ao atualizar cliente (API):',
					err.response?.data || err.message,
				);
				setError(err.response?.data?.message || 'Falha ao atualizar cliente.');
			} finally {
				setEditClientId(undefined);
				setEditClientData(undefined);
				setShowCreateModal(false);
			}
			return;
		}

		const tempId = `temp-${Date.now()}-${Math.random()
			.toString(36)
			.substring(2, 9)}`;

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

	// Ação do botão de "+" (adicionar à seleção)
	const handleAddClientToSelection = (client: Client) => {
		if (client.id) {
			if (isClientSelected(client.id)) {
				removeClientFromSelection(client.id);
			} else {
				// Passar o objeto Client completo, ou apenas os dados necessários
				addClientToSelection({
					id: client.id,
					name: client.name,
					salary: client.salary,
					company: client.company,
				});
			}
		}
	};

	const handleEditClient = (clientId: string) => {
		const clientToEdit = clients.find((c) => c.id === clientId);
		if (clientToEdit) {
			setEditClientData(clientToEdit);
			setEditClientId(clientId);
			setShowCreateModal(true);
		}
	};

	const confirmDelete = (client: Client) => {
		setClientToDelete(client);
	};

	const handleAlertDeleteConfirmed = async () => {
		if (clientToDelete && clientToDelete.id) {
			try {
				await api.delete(`/clients/${clientToDelete.id}`);
				setClients((prevClients) =>
					prevClients.filter((client) => client.id !== clientToDelete.id),
				);
				setTotalClients((prevTotal) => prevTotal - 1);
				// Remover também da seleção se estiver lá
				removeClientFromSelection(clientToDelete.id);
			} catch (err) {
				setError('Não foi possível excluir o cliente. Tente novamente.');
			} finally {
				setClientToDelete(null);
			}
		}
	};

	const handleAlertDeleteCancelled = () => {
		setClientToDelete(null);
	};

	return (
		<div className="min-h-screen bg-[#F0F2F5] text-gray-800 font-sans">
			<Header userName={localStorage.getItem('userName') || 'Usuário'} />
			<div className="container mx-auto p-6">
				<div className="flex justify-between items-center mb-6 flex-wrap gap-4">
					<h2 className="text-xl font-semibold text-gray-700">
						{totalClients} clientes encontrados:
					</h2>
					<div className="flex items-center space-x-2 text-gray-600">
						<span>Clientes por página:</span>
						<select
							className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800"
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
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
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
					<p className="text-center text-gray-500">Carregando clientes...</p>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
							{clients.map((client) => (
								<ClientCard
									key={client.id}
									id={client.id}
									name={client.name}
									salary={client.salary || ''}
									company={client.company || ''}
									status={client.status}
									onAdd={() => handleAddClientToSelection(client)}
									isSelected={isClientSelected(client.id)}
									onEdit={() => client.id && handleEditClient(client.id)}
									onDelete={() => client.id && confirmDelete(client)}
								/>
							))}
						</div>

						<div className="text-center mb-8 w-full">
							<div className="text-center mb-8">
								<Button
									onClick={() => {
										setEditClientData(undefined);
										setEditClientId(undefined);
										setShowCreateModal(true);
									}}
									className="border-3 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-colors duration-200 cursor-pointer px-8 py-3 text-lg font-medium w-full rounded-md"
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
				onClose={() => {
					setShowCreateModal(false);
					setEditClientData(undefined);
					setEditClientId(undefined);
				}}
				title={editClientId ? 'Editar Cliente' : 'Criar cliente:'}
			>
				<ClientForm
					onSubmit={handleCreateClientSubmit}
					onCancel={() => {
						setShowCreateModal(false);
						setEditClientData(undefined);
						setEditClientId(undefined);
					}}
					initialData={editClientData}
					isLoading={loading}
				/>
			</Modal>
			{clientToDelete && (
				<div className="fixed inset-0 bg-gray-200/60 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded shadow-lg text-center">
						<h2 className="text-xl font-bold mb-4">Excluir cliente:</h2>

						<p className="mb-6">
							Você está prestes a excluir o cliente:{' '}
							<b>{clientToDelete.name}</b>
						</p>
						<div className="flex justify-center space-x-4">
							<button
								onClick={handleAlertDeleteCancelled}
								className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
							>
								Cancelar
							</button>
							<button
								onClick={handleAlertDeleteConfirmed}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
