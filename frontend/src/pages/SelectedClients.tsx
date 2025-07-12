import React, { useState, useEffect, useRef, useCallback } from 'react'; // Adicionado useCallback
import { ClientCard } from '../lib/components/ClientCard';
import { api } from '../api.ts';
import { Header } from '../lib/components/Header';
import { Button } from '../lib/components/Button';
import { Modal } from '../lib/components/Modal';
import { ClientForm } from '../lib/components/ClientForm';
import { Pagination } from '../lib/components/Pagination';
import { BiRefresh } from 'react-icons/bi';

// A interface Client foi ajustada: 'email' foi removido para refletir o ClientForm
// 'id' agora é definitivamente string, e os campos numéricos são string para consistência com o ClientForm
interface Client {
	id: string; // ID é essencial e deve ser string (pode ser UUID)
	name: string;
	salary?: string; // String para o valor numérico bruto (ex: "3500")
	company?: string; // String para o valor numérico bruto (ex: "120000")
	// email?: string; // Removido, pois não está sendo usado no ClientForm e no design da tela
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

	// Adicionado para edição
	const [editClientData, setEditClientData] = useState<
		| {
				name: string;
				email?: string; // Mantido opcionalmente aqui, caso a API ainda retorne ou necessite
				salary?: string;
				company?: string;
				id?: string; // Aqui é string, vindo da API
		  }
		| undefined
	>(undefined);
	const [editClientId, setEditClientId] = useState<string | undefined>(
		undefined,
	);

	const eventSourceRef = useRef<EventSource | null>(null);

	// useCallback para `fetchClients` para evitar re-criação desnecessária

	useEffect(() => {
		const sseUrl = `${
			import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
		}/events?eventType=client.created`;

		const setupEventSource = () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
			eventSourceRef.current = new EventSource(sseUrl);

			eventSourceRef.current.addEventListener('client.created', (event) => {
				try {
					const newClientData: Client = JSON.parse(event.data);
					setClients((prevClients) => {
						const updatedClient = {
							...newClientData,
							id: String(newClientData.id), // Garante que o ID é string
							status: 'created',
						};

						// Tenta encontrar e atualizar o cliente temporário ou falho
						const existingClientIndex = prevClients.findIndex(
							(c) =>
								c.id === updatedClient.id ||
								(c.name === updatedClient.name && c.status === 'creating'), // Adicionado verificação por nome para temporários sem ID real ainda
						);

						if (existingClientIndex !== -1) {
							const updatedClients = [...prevClients];
							updatedClients[existingClientIndex] = updatedClient;
							return updatedClients;
						} else {
							// Adiciona o novo cliente apenas se ele não estiver já na lista por ID
							if (!prevClients.some((c) => c.id === updatedClient.id)) {
								return [updatedClient, ...prevClients];
							}
							return prevClients;
						}
					});
					// O total de clientes será atualizado na próxima fetchClients
					// ou você pode adicionar um debounce para fetchClients aqui
					// setTotalClients((prevTotal) => prevTotal + 1); // Removido: buscar total é mais robusto
				} catch (e) {
					console.error('Erro ao fazer parse do evento SSE:', e);
				}
			});

			eventSourceRef.current.onerror = (e) => {
				console.error('Erro no EventSource:', e);
				eventSourceRef.current?.close();
				setError('Erro de conexão com o servidor. Tentando reconectar...');
				setTimeout(setupEventSource, 5000); // Tenta reconectar
			};
		};

		setupEventSource(); // Chama a função para configurar o EventSource

		return () => {
			eventSourceRef.current?.close();
		};
	}, []); // Depende apenas de fetchClients agora

	const handleCreateClientSubmit = async (clientData: {
		name: string;
		salary?: string;
		company?: string;
		// email?: string; // Removido, pois não está no ClientForm
	}) => {
		// Se estiver editando, chame a função de edição
		if (editClientId) {
			try {
				// `clientData` já vem com salary/company como strings de números puros
				await api.patch(`/clients/${editClientId}`, clientData); // Não precisa de `{ headers: ..., data: ... }`
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
		// Gerar um ID temporário robusto, mesmo que a API não o use imediatamente
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

	const handleAddClientToSelection = (clientId: string) => {
		console.log(
			`Adicionar cliente ${clientId} à seleção (funcionalidade ainda não implementada).`,
		);
		// Lógica para adicionar à seleção, se aplicável no contexto do projeto.
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

	const handleAlertDeleteConfirmed = async () => {
		// Tornar async
		if (clientToDelete && clientToDelete.id) {
			// Verificar se o id existe
			try {
				await api.delete(`/clients/${clientToDelete.id}`);
				setClients((prevClients) =>
					prevClients.filter((client) => client.id !== clientToDelete.id),
				);
				setTotalClients((prevTotal) => prevTotal - 1);
				console.log(`Cliente ${clientToDelete.id} excluído com sucesso.`);
			} catch (err) {
				console.error('Erro ao excluir cliente:', err);
				setError('Não foi possível excluir o cliente. Tente novamente.');
			} finally {
				setClientToDelete(null); // Fechar o modal de confirmação
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
									// Usar o ID fornecido pela API ou o temporário
									key={client.id}
									id={client.id}
									name={client.name}
									salary={client.salary || ''} // Pode ser string vazia se undefined
									company={client.company || ''} // Pode ser string vazia se undefined
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
							<div className="text-center mb-8">
								<Button
									onClick={() => {
										setEditClientData(undefined); // Garante que não está em modo de edição
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
					setEditClientData(undefined); // Limpar dados de edição ao fechar
					setEditClientId(undefined); // Limpar ID de edição ao fechar
				}}
				title={editClientId ? 'Editar Cliente' : 'Criar cliente:'}
			>
				<ClientForm
					onSubmit={handleCreateClientSubmit}
					onCancel={() => {
						setShowCreateModal(false);
						setEditClientData(undefined); // Limpar dados de edição ao cancelar
						setEditClientId(undefined); // Limpar ID de edição ao cancelar
					}}
					initialData={editClientData}
					// Adicione isLoading aqui se você tiver um estado de loading no ClientForm
					// isLoading={...}
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
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors" // Cor de exclusão mais apropriada
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
