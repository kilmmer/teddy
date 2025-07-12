import { Link, NavLink, useNavigate } from 'react-router-dom';

interface HeaderProps {
	userName: string;
}

export function Header({ userName }: HeaderProps) {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear(); // ou localStorage.removeItem('token')
		navigate('/');
	};

	return (
		<header className="bg-gray-100 py-4 px-24 text-white flex justify-between items-center shadow-md">
			<div className="flex items-center space-x-4">
				<Link to="/">
					<img
						src="/img/Logo-Teddy.png"
						alt="Teddy Logo"
						className="h-8 w-auto"
					/>
				</Link>
			</div>
			<nav className="hidden md:flex justify-center space-x-6">
				<NavLink
					to="/clients"
					className={({ isActive }) =>
						`${
							isActive
								? 'text-[#FF6B00] font-bold underline'
								: 'text-gray-500 hover:text-[#FF6B00] transition-colors duration-200'
						}`
					}
				>
					Clientes
				</NavLink>

				<NavLink
					to="/selected-clients"
					className={({ isActive }) =>
						`${
							isActive
								? 'text-[#FF6B00] font-bold underline'
								: 'text-gray-500 hover:text-[#FF6B00] transition-colors duration-200 '
						}`
					}
				>
					Clientes selecionados
				</NavLink>

				{/* Botão Sair */}
				<button
					onClick={handleLogout}
					className="text-gray-500 hover:text-[#FF6B00] transition-colors duration-200"
				>
					Sair
				</button>
			</nav>
			<div className="flex items-center space-x-4">
				<span className="text-gray-600">
					Olá, <b>{userName}</b>!
				</span>
			</div>
		</header>
	);
}
