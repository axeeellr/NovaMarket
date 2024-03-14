import React from 'react';
import { Link } from 'react-router-dom';
import '../css/menu.css';
import qrCode from '../assets/qrCode.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStore, faBell, faCog, faQrcode } from '@fortawesome/free-solid-svg-icons';

function Menu() {
  return (
    <div className="menu__container">
      <div className="menu">
        <div className="menu__left">
          <Link to="/"> {/* Agrega un enlace al ícono de inicio */}
            <FontAwesomeIcon icon={faHome} />
          </Link>
          <Link to="/shop"> {/* Agrega un enlace al ícono de la tienda */}
            <FontAwesomeIcon icon={faStore} />
          </Link>
        </div>
        <div className="menu__center">
          <Link to="/scanner"> {/* Agrega un enlace al ícono de la tienda */}
            <img src={qrCode} className='scannerIcon' />
          </Link>
        </div>
        <div className="menu__right">
          <Link to="/notifications"> {/* Agrega un enlace al ícono de notificaciones */}
            <FontAwesomeIcon icon={faBell} />
          </Link>
          <Link to="/profile"> {/* Agrega un enlace al ícono de configuración */}
            <FontAwesomeIcon icon={faCog} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Menu;
