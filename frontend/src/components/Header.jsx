import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';

import qrCode from '../assets/qrCode.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStore, faBell, faUser, faCartPlus } from '@fortawesome/free-solid-svg-icons';

import Notifications from './Notifications';

import '../css/header.css';

function Header() {
    const location = useLocation();
    // Obtener el estado del usuario del contexto
    const { user } = useUser();

    // Estado para mostrar o ocultar notificaciones
    const [showNotifications, setShowNotifications] = useState(false);

    // Alternar el estado de las notificaciones
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItemCount(cart.length);
    }, []);

    return (
        <div className="header">
            <div className="header__info">
                <div className="header__info__text">
                    <h2>{user ? `Hey, ${user.name}!` : 'Hey!'}</h2>
                    <p>¿Qué comprarás hoy?</p>
                </div>
                <div className="header__info__img">
                    <div className="menu-header">
                        <div className="menu__left-header">
                            <NavLink to="/"> 
                                <FontAwesomeIcon icon={faHome} />
                            </NavLink>
                            <NavLink to="/shop"> 
                                <FontAwesomeIcon icon={faStore} />
                            </NavLink>
                        </div>
                        <div className="menu__center-header">
                            <NavLink to="/scanner"> 
                                <img src={qrCode} className="scannerIcon-header" alt="Scanner Icon" />
                            </NavLink>
                        </div>
                        <div className="menu__right-header">
                            <NavLink to="/cart">
                                <div className="cart-icon-container-header">
                                    <FontAwesomeIcon icon={faCartPlus} />
                                    {cartItemCount > 0 && (
                                        <span className="cart-item-count-header">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </div>
                            </NavLink>
                            <NavLink to="/profile"> 
                                <FontAwesomeIcon icon={faUser} />
                            </NavLink>
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faBell} className='notis' onClick={toggleNotifications} />
                </div>
            </div>
            <form className="header__search">
                <input type="search" name="" id="" placeholder="¿Algún comentario? Contáctate con nosotros" />
            </form>
            {showNotifications && <Notifications />}
        </div>
    );
}

export default Header;
