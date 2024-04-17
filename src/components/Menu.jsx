import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/menu.css';
import qrCode from '../assets/qrCode.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStore, faBell, faUser, faCartPlus } from '@fortawesome/free-solid-svg-icons';

function Menu() {
  return (
    <div className="menu__container">
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
            <img src={qrCode} className='scannerIcon' />
          </NavLink>
        </div>
        <div className="menu__right">
          <NavLink to="/cart"> {/* Agrega un enlace al ícono de notificaciones */}
            <FontAwesomeIcon icon={faCartPlus} />
          </NavLink>
          <NavLink to="/profile"> {/* Agrega un enlace al ícono de configuración */}
            <FontAwesomeIcon icon={faUser} />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Menu;
