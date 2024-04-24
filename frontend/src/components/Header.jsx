import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import Notifications from './Notifications';

import '../css/header.css';

function Header() {

  const [userr, setUserr] = useState(null); 
  const [userIdStorage, setUserIdStorage] = useState(null);

  let userContext = null;

  if (!userContext) {
    userContext = useUser();
  }  

  const { user } = userContext ? userContext : {};

  // useEffect(() => {
  //   if (user && user.id) {
  //     localStorage.setItem('userId', user.id);
  //     setUserId(user.id);
  //   }
  // }, [user]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserIdStorage(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userIdStorage) {
      const handleData = () => {
        axios.get(`http://localhost:1001/data/${userIdStorage}`)
          .then(response => {
            const userrData = response.data.user.name;
            setUserr(userrData);
          })
          .catch(error => {
            console.error(error);
          });
      };

      handleData();
    }
  }, [userIdStorage]);

  console.log("Valor del usuario:", userr);

 
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="header">
      <div className="header__info">
      <div className="header__info__text">
          {userr ? <h2>Hey, {userr}!</h2> : <h2>Hey!</h2>}
          <p>¿Qué comprarás hoy?</p>
        </div>
        <div className="header__info__img">
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