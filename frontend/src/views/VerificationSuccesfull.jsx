import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import TitlePage from '../components/TitlePage';

import vendedor from '../assets/vendedor.png';

import '../css/verification.css';

const VerificationSuccessfull = () => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate('/')
    }

    return(
        <>
        <div className="verification">
            <div className="verification__info">
                <h1>¡Verificación exitosa!</h1>
                <p>Ya puedes usar NovaMarket, haz click en el botón o vuelve a la página de verificación para continuar.</p>
                <button onClick={goHome}>IR A NOVAMARKET</button>
            </div>
            <img src={vendedor} />
        </div>
        </>
    )
};

export default VerificationSuccessfull;
