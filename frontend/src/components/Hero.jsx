import React from 'react';
import { Link } from 'react-router-dom';
import '../css/hero.css';

function Hero() {
    return (
        <div className="hero">
          <img src="https://st2.depositphotos.com/5746398/8420/i/450/depositphotos_84205586-stock-photo-shopping-cart-in-a-supermarket.jpg" alt="" />
          <h1>¡Ya puedes hacer las compras sin hacer fila!</h1>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button>Registrarme</button>
          </Link>
        </div>
    );
}
  
export default Hero;