// import { useState } from "react";
// import { api } from "../api";

// export function Login() {
//   const [name, setName] = useState<string>("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await api.post("/auth/login", { name });
//       alert(`Olá, ${name}!`);
//     } catch {
//       alert("Erro ao fazer login. Tente novamente.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen w-full h-full">
//       <form
//         className="bg-white p-2 col-span-1 text-center"
//         method="post"
//         onSubmit={handleLogin}
//       >
//         <h1 className="text-3xl font-regular text-gray-800 mb-4">
//           Olá, seja bem-vindo!
//         </h1>
//         <input
//           type="text"
//           placeholder="Digite o seu nome:"
//           className="border-2 border-gray-300 p-3 mb-4 rounded-sm w-72 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-300 text-gray-600"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <br />
//         <button
//           className="bg-orange-500 text-white p-3 py-2 w-72 rounded-sm hover:bg-orange-600 transition-colors duration-300 cursor-pointer"
//           type="submit"
//         >
//           Entrar
//         </button>
//       </form>
//     </div>
//   );
// }

// src/components/Welcome.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export function Login() {
	const [name, setName] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await api.post('/auth/login', { name });
			// Assumindo que o token vem na propriedade 'token' da resposta
			const token = res.data.accessToken;
			if (token) {
				localStorage.setItem('token', token);
				localStorage.setItem('userName', res.data.user.name);
				localStorage.setItem('userId', res.data.user.id);
			}
			// alert(`Olá, ${name}!`);
			navigate('clients');
		} catch {
			alert('Erro ao fazer login. Tente novamente.');
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen w-full h-full">
			<form
				className="bg-white p-2 col-span-1 text-center"
				method="post"
				onSubmit={handleSubmit}
			>
				<h1 className="text-3xl font-regular text-gray-800 mb-4">
					Olá, seja bem-vindo!
				</h1>
				<input
					type="text"
					placeholder="Digite o seu nome:"
					className="border-2 border-gray-300 p-3 mb-4 rounded-sm w-72 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-300 text-gray-600"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<br />
				<button
					className="bg-orange-500 text-white p-3 py-2 w-72 rounded-sm hover:bg-orange-600 transition-colors duration-300 cursor-pointer"
					type="submit"
				>
					Entrar
				</button>
			</form>
		</div>
	);
}
