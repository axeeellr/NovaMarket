import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import vendedor from '../assets/vendedor.png';
import '../css/shop.css';

const Help = ({ helpVisible, setHelpVisible }) => {
    return (
        <div className={`shop__help ${!helpVisible ? 'hidden' : ''}`}>
            <FontAwesomeIcon icon={faCircleXmark} className='help__close' onClick={() => setHelpVisible(false)} />
            <div className="help__info">
                <h1>Bienvenido a la Tienda de NovaMarket</h1>
                <p>Hola, soy Don Mario! Haz click en los productos que quieras para seleccionarlos. Puedes hablar conmigo en el chat de abajo, será un gusto atenderte.</p>
            </div>
            <img src={vendedor} />
        </div>
    );
};

export default Help;
