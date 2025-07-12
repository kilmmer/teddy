import {
	createContext,
	useState,
	useContext,
	useCallback,
	type ReactNode,
} from 'react';

// Interface para o cliente selecionado (pode ser mais simples que a Client completa)
// Basta o ID para a seleção, mas podemos manter mais dados se necessário para display
interface SelectedClient {
	id: string;
	name: string;
	salary?: string;
	company?: string;
}

// Interface para o valor do contexto
interface SelectedClientsContextType {
	selectedClients: SelectedClient[];
	addClientToSelection: (client: SelectedClient) => void;
	removeClientFromSelection: (clientId: string) => void;
	isClientSelected: (clientId: string) => boolean;
}

// Crie o contexto com um valor inicial (pode ser null ou um objeto com funções vazias)
const SelectedClientsContext = createContext<
	SelectedClientsContextType | undefined
>(undefined);

// Crie o Provider para envolver a parte da sua aplicação que precisa de acesso a este contexto
interface SelectedClientsProviderProps {
	children: ReactNode;
}

export function SelectedClientsProvider({
	children,
}: SelectedClientsProviderProps) {
	const [selectedClients, setSelectedClients] = useState<SelectedClient[]>([]);

	// Adiciona um cliente à seleção
	const addClientToSelection = useCallback((client: SelectedClient) => {
		setSelectedClients((prev) => {
			if (!prev.some((c) => c.id === client.id)) {
				return [...prev, client];
			}
			return prev; // Já está selecionado
		});
	}, []);

	// Remove um cliente da seleção
	const removeClientFromSelection = useCallback((clientId: string) => {
		setSelectedClients((prev) => prev.filter((c) => c.id !== clientId));
	}, []);

	// Verifica se um cliente já está selecionado
	const isClientSelected = useCallback(
		(clientId: string) => {
			return selectedClients.some((c) => c.id === clientId);
		},
		[selectedClients],
	);

	const contextValue = {
		selectedClients,
		addClientToSelection,
		removeClientFromSelection,
		isClientSelected,
	};

	return (
		<SelectedClientsContext.Provider value={contextValue}>
			{children}
		</SelectedClientsContext.Provider>
	);
}

// Custom Hook para consumir o contexto facilmente
export function useSelectedClients() {
	const context = useContext(SelectedClientsContext);
	if (context === undefined) {
		throw new Error(
			'useSelectedClients must be used within a SelectedClientsProvider',
		);
	}
	return context;
}
