import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';

function Header() {
  return (
    <div className="header">
      <div className="header__info">
        <div className="header__info__text">
          <h2>Hey, Ricardo!</h2>
          <p>¿Qué comprarás hoy?</p>
        </div>
        <div className="header__info__img">
          <Link to="/login">
            <img src="https://i.pinimg.com/736x/e8/12/d5/e812d5e3dd7809db8a75a158125a79be.jpg" alt="" />
          </Link>
        </div>
      </div>
      <form className="header__search">
        <input type="search" name="" id="" placeholder="Busca tus próximas compras" />
      </form>
    </div>
  );
}

export default Header;