import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Login } from './pages/Login';
import { Clients } from './pages/Clients';
import { SelectedClients } from './pages/SelectedClients';
import { SelectedClientsProvider } from './contexts/selectedClients.context';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<SelectedClientsProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/clients" element={<Clients />} />
					<Route path="/selected-clients" element={<SelectedClients />} />
				</Routes>
			</BrowserRouter>
		</SelectedClientsProvider>
	</React.StrictMode>,
);
