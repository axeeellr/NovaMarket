import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../css/menu.css';
const qrCode = 'https://novamarket-img.s3.us-east-2.amazonaws.com/qrCode.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStore, faBell, faUser, faCartPlus } from '@fortawesome/free-solid-svg-icons';

function Menu() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/'); // Verifica si estás en la página de Product.jsx

  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItemCount(cart.length);
  }, []);

  return (
    <div className={`menu__container ${isProductPage ? 'menu__container__product' : ''}`}> {/* Agrega la clase adicional si estás en Product.jsx */}
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
  );
}

export default Menu;
