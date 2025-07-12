import { useState, useEffect } from 'react';
import axios from 'axios';

interface Client {
	id: number;
	name: string;
}

export function ClientList() {
	const [clients, setClients] = useState<Client[]>([]);
	const [name, setName] = useState('');
	const [selectedClient, setSelectedClient] = useState<Client | null>(null);

	useEffect(() => {
		fetchClients();
	}, []);

	const fetchClients = async () => {
		const response = await axios.get('http://localhost:3000/clients'); // Ajuste a URL do backend
		setClients(response.data);
	};

	const addClient = async (e: React.FormEvent) => {
		e.preventDefault();
		await axios.post('http://localhost:3000/clients', { name });
		setName('');
		fetchClients();
	};

	const deleteClient = async (id: number) => {
		await axios.delete(`http://localhost:3000/clients/${id}`);
		fetchClients();
	};

	const selectClient = (client: Client) => setSelectedClient(client);

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<h1 className="text-2xl font-semibold text-gray-800 mb-4 font-inter">
				Lista de Clientes
			</h1>
			<form onSubmit={addClient} className="mb-4">
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Novo cliente"
					className="border p-2 mr-2 rounded font-inter"
				/>
				<button
					type="submit"
					className="bg-orange-500 text-white px-4 py-2 rounded font-inter"
				>
					Adicionar
				</button>
			</form>
			<ul className="bg-white p-4 rounded-lg shadow-md">
				{clients.map((client: Client) => (
					<li key={client.id} className="flex justify-between mb-2">
						<span className="font-inter">{client.name}</span>
						<div>
							<button
								onClick={() => selectClient(client)}
								className="bg-blue-500 text-white px-2 py-1 rounded mr-2 font-inter"
							>
								Ver
							</button>
							<button
								onClick={() => deleteClient(client.id)}
								className="bg-red-500 text-white px-2 py-1 rounded font-inter"
							>
								Excluir
							</button>
						</div>
					</li>
				))}
			</ul>
			{selectedClient && (
				<div className="mt-4 bg-white p-4 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold font-inter">
						Detalhes do Cliente
					</h2>
					<p className="font-inter">Nome: {selectedClient.name}</p>
					{/* Adicione campos ou formulário para atualizar */}
				</div>
			)}
		</div>
	);
}
