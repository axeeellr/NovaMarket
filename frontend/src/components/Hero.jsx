import React from 'react';
import { Link } from 'react-router-dom';

import { useUser } from '../UserContext';
import logo from '../assets/novamarketv3.png';
import videobackground from '../assets/NovaMarket2.mp4';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';

import '../css/hero.css';

function Hero() {
    const { isAuthenticated } = useUser();

    return (
        <>
        <div className="hero">
            <video src={videobackground} className='background' id='background-video' autoPlay muted loop playsInline></video>
            <div className="hero__info">
                <img src={logo} className='logo' />
                <h1>¡Donde puedes comprar sin esperar!</h1>
                {isAuthenticated === true ? (
                    <Link to="/shop" style={{ textDecoration: 'none' }}>
                        <button>COMPRAR</button>
                    </Link>
                    ) : (
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <button>INICIAR</button>
                    </Link>
                )}
            </div>
        </div>

        <div className="hero__pc">
            <video src={videobackground} className='background__pc' id='background-video' autoPlay muted loop playsInline></video>
            <div className="hero__info__pc">
                <h1>¡Donde puedes comprar sin esperar!</h1>
                <p>¡Bienvenido a NovaMarket! Donde puedes hacer tus compras del supermercado fácil, rápido y en un par de clicks.</p>
                {isAuthenticated === true ? (
                    <Link to="/shop" style={{ textDecoration: 'none' }}>
                        <button>COMPRAR</button>
                    </Link>
                    ) : (
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <button>INICIAR</button>
                    </Link>
                )}
            </div>
        </div>
        </>
    );
}

export default Hero;