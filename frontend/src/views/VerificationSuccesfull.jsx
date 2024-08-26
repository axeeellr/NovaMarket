import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

import vendedor from '../assets/vendedor.png';
import '../css/verification.css';

const VerificationSuccessful = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();


    return (
        <div className="verification">
            <div className="verification__info">
                <h1>¡Verificación exitosa!</h1>
                <p>Ya puedes ir a la página de NovaMarket y usar todas sus funciones.</p>
            </div>
            <img src={vendedor} alt="Vendedor" />
        </div>
    );
};

export default VerificationSuccessful;
