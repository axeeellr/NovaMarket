import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../css/menu.css';
import qrCode from '../assets/qrCode.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStore, faBell, faUser, faCartPlus } from '@fortawesome/free-solid-svg-icons';

function Menu() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/'); // Verifica si estás en la página de Product.jsx

  return (
    <div className={`menu__container ${isProductPage ? 'menu__container__product' : ''}`}> {/* Agrega la clase adicional si estás en Product.jsx */}
      <div className="menu">
        <div className="menu__left">
          <NavLink to="/"> {/* Agrega un enlace al ícono de inicio */}
            <FontAwesomeIcon icon={faHome} />
          </NavLink>
          <NavLink to="/shop"> {/* Agrega un enlace al ícono de la tienda */}
            <FontAwesomeIcon icon={faStore} />
          </NavLink>
        </div>
        <div className="menu__center">
          <NavLink to="/scanner"> {/* Agrega un enlace al ícono de la tienda */}
            <img src={qrCode} className="scannerIcon" alt="Scanner Icon" />
          </NavLink>
        </div>
        <div className="menu__right">
          <NavLink to="/cart"> {/* Agrega un enlace al ícono de carrito */}
            <FontAwesomeIcon icon={faCartPlus} />
          </NavLink>
          <NavLink to="/profile"> {/* Agrega un enlace al ícono de perfil */}
            <FontAwesomeIcon icon={faUser} />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Menu;
