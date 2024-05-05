import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import Notifications from './Notifications';

import '../css/header.css';

function Header() {
    // Obtener el estado del usuario del contexto
    const { user } = useUser();

    // Estado para mostrar o ocultar notificaciones
    const [showNotifications, setShowNotifications] = useState(false);

    // Alternar el estado de las notificaciones
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className="header">
            <div className="header__info">
                <div className="header__info__text">
                    {/* Mostrar el nombre del usuario si está disponible, de lo contrario, solo mostrar "Hey!" */}
                    <h2>{user ? `Hey, ${user.name}!` : 'Hey!'}</h2>
                    <p>¿Qué comprarás hoy?</p>
                </div>
                <div className="header__info__img">
                    {/* Ícono de campana para alternar las notificaciones */}
                    <FontAwesomeIcon icon={faBell} className='notis' onClick={toggleNotifications} />
                </div>
            </div>
            <form className="header__search">
                <input type="search" name="" id="" placeholder="¿Algún comentario? Contáctate con nosotros" />
            </form>
            {/* Mostrar el componente de notificaciones si está habilitado */}
            {showNotifications && <Notifications />}
        </div>
    );
}

export default Header;
