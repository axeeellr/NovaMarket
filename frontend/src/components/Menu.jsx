import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/menu.css';
import novalogoPc from '../assets/novamarketv3.png';
const vendedor = 'https://novamarket-img.s3.us-east-2.amazonaws.com/vendedor.png';
const qrCode = 'https://novamarket-img.s3.us-east-2.amazonaws.com/qrCode.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStore, faUser, faCartPlus } from '@fortawesome/free-solid-svg-icons';

function Menu() {
    const navigate = useNavigate();
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItemCount(cart.length);
    }, []);

    const handleChatClick = () => {
        // Guarda en localStorage o utiliza un estado global para mantener el chat visible
        localStorage.setItem('chatVisible', 'true');
        navigate('/shop'); // Redirigir a la página /shop
    };

    return (
        <>
            <div className="menu__container">
                <div className="menu">
                    <div className="menu__left">
                        <NavLink to="/">
                            <FontAwesomeIcon icon={faHome} />
                        </NavLink>
                        <NavLink to="/shop">
                            <FontAwesomeIcon icon={faStore} />
                        </NavLink>
                    </div>
                    <div className="menu__center">
                        <NavLink to="/scanner">
                            <img src={qrCode} className="scannerIcon" alt="Scanner Icon" />
                        </NavLink>
                    </div>
                    <div className="menu__right">
                        <NavLink to="/cart">
                            <div className="cart-icon-container">
                                <FontAwesomeIcon icon={faCartPlus} />
                                {cartItemCount > 0 && (
                                    <span className="cart-item-count">
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
            </div>

            <div className="menu__container__pc">
                <div className="pc__logo">
                    <img src={novalogoPc} alt="" />
                </div>
                <div className="pc__menu">
                    <NavLink to="/" className='pc__menu__option'>
                        <FontAwesomeIcon icon={faHome} />
                        <p>Inicio</p>
                    </NavLink>
                    <NavLink to="/shop" className='pc__menu__option'>
                        <FontAwesomeIcon icon={faStore} />
                        <p>Tienda</p>
                    </NavLink>
                    <NavLink to="/scanner" className='pc__menu__option pcscan'>
                        <img src={qrCode} className="scannerIconPc" alt="Scanner Icon" />
                        <p>Escáner</p>
                    </NavLink>
                    <NavLink to="/cart" className='pc__menu__option'>
                        <div className="cart-icon-containerPc">
                            <FontAwesomeIcon icon={faCartPlus} />
                            {cartItemCount > 0 && (
                                <span className="cart-item-countPc">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>
                        <p>Carrito</p>
                    </NavLink>
                    <NavLink to="/profile" className='pc__menu__option'>
                        <FontAwesomeIcon icon={faUser} />
                        <p>Perfil</p>
                    </NavLink>
                </div>
                <div className="pc__chat" onClick={handleChatClick}>
                    <div className="chat__thumbnailPc">
                        <img src={vendedor} />
                        <p>1</p>
                    </div>
                    <h2>Chat</h2>
                </div>
            </div>
        </>
    );
}

export default Menu;
