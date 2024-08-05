import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../UserContext'; // Asegúrate de que la ruta es correcta
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario después de cerrar sesión

const HeaderAdmin = () => {
    const { logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirige al usuario a la página de inicio de sesión
    };

    return (
        <div className="admin__header">
            <h1>Gestión de entregas de NovaMarket</h1>
            <button onClick={handleLogout}>
                Cerrar Sesión
                <FontAwesomeIcon icon={faSignOut} />
            </button>
        </div>
    );
};

export default HeaderAdmin;
