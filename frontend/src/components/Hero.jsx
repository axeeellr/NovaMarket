import React from 'react';
import { Link } from 'react-router-dom';

import { useUser } from '../UserContext';
//import { decryptData } from '../CryptoUtils'; 

import '../css/hero.css';

function Hero() {
  const { isAuthenticated } = useUser();

  return (
      <div className="hero">
        <img src="https://estaticos-cdn.prensaiberica.es/clip/b65f4b2d-9021-43a8-9dac-6d74a2144a4c_16-9-discover-aspect-ratio_default_0.jpg" alt="" />
        <h1>¡Ya puedes hacer las compras sin hacer fila!</h1>
        {isAuthenticated === true ? (
        <Link to="/shop" style={{ textDecoration: 'none' }}>
          <button>Empezar a comprar</button>
        </Link>
      ) : (
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button>Registrarme</button>
        </Link>
      )}
      </div>
  );
}
  
export default Hero;