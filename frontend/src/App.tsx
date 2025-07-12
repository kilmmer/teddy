import { useEffect, useState } from 'react';
import { api } from './api';

function App() {
	interface Client {
		id: number;
		name: string;
	}
	const [clients, setClients] = useState<Client[]>([]);

	useEffect(() => {
		api
			.get('/clients')
			.then((res) => setClients(res.data))
			.catch((err) => console.error(err));
	}, []);

	return (
		<div>
			<h1>Lista de Clientes</h1>
			<ul>
				{clients.map((client: { id: number; name: string }) => (
					<li key={client.id}>{client.name}</li>
				))}
			</ul>
		</div>
	);
}

export default App;
