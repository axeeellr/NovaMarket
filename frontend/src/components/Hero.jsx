import React from 'react';
import { Link } from 'react-router-dom';

import { useUser } from '../UserContext';
import logo from '../assets/novamarketv3.png';
import videobackground from '../assets/supermarketvideo.mp4';

import '../css/hero.css';

function Hero() {
    const { isAuthenticated } = useUser();

    return (
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
    );
}

export default Hero;