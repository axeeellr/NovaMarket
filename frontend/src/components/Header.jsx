import React, {useState} from 'react';
import { useUser } from '../UserContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faBell } from '@fortawesome/free-solid-svg-icons';

import Notifications from './Notifications';

import '../css/header.css';

function Header() {

  const { user } = useUser();
  console.log("Valor del usuario:", user);

  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="header">
      <div className="header__info">
        <div className="header__info__text">
          {user ? (<h2>Hey, {user.name}!</h2>) : (<h2>Hey!</h2>)}
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