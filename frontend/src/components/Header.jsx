import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

import qrCode from '../assets/qrCode.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStore, faBell, faUser, faCartPlus } from '@fortawesome/free-solid-svg-icons';

import Notifications from './Notifications';

import '../css/header.css';

function Header() {
    const location = useLocation();
    const { user } = useUser();

    const [showNotifications, setShowNotifications] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItemCount(cart.length);
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            if (comment.trim() === '') return;

            if (user) {
                try {
                    const response = await axios.post('https://novamarket-backend-bb524c4ea0b6.herokuapp.com/comments', {
                        userId: user ? user.id : null,  // Asumiendo que el user tiene un id
                        comment
                    });
    
                    if (response.status === 201) {
                        toast.success('Comentario guardado con éxito');
                        setComment('');  // Limpiar el campo de comentario después de enviarlo
                    }
                } catch (error) {
                    console.error('Error al guardar el comentario:', error);
                    toast.error('Hubo un problema al guardar el comentario');
                }
            }else{
                toast.error('¡Inicia sesión para comentar!');
            }
        }
    };

    return (
        <>
        <div className="header headerhome">
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
            <form className="header__search" onKeyDown={handleCommentSubmit}>
                <input
                    type="search"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="¿Algún comentario? Contáctate con nosotros"
                />
            </form>
            {showNotifications && <Notifications />}
        </div>

        <Toaster
            toastOptions={{
                duration: 3000,
                style: {
                    background: '#193E4E',
                    color: '#F2EBCF',
                    textAlign: 'center'
                },
            }}
        />
        </>
    );
}

export default Header;
