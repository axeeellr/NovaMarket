import React, {useState} from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faBell } from '@fortawesome/free-solid-svg-icons';

import Notifications from './Notifications';

import '../css/header.css';

function Header() {

  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="header">
      <div className="header__info">
        <div className="header__info__text">
          <h2>Hey, Ricardo!</h2>
          <p>¿Qué comprarás hoy?</p>
        </div>
        <div className="header__info__img">
          <FontAwesomeIcon icon={faBell} className='notis' onClick={toggleNotifications}/>
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