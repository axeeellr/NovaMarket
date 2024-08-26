import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

import vendedor from '../assets/vendedor.png';
import '../css/verification.css';

const VerificationSuccessful = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await axios.get(`https://novamarket-backend-bb524c4ea0b6.herokuapp.com/verify-email?token=${token}`);
                // Redirige a la página principal o de éxito
                navigate('/');
            } catch (error) {
                console.error('Error al verificar el token:', error);
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token, navigate]);

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
