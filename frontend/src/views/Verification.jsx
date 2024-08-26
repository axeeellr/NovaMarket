import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useUser } from '../UserContext';

import TitlePage from '../components/TitlePage';
import vendedor from '../assets/vendedor.png';
import '../css/verification.css';

const Verification = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const userId = user.id;

    useEffect(() => {
        const checkVerificationStatus = async () => {
            try {
                const response = await axios.get(`https://novamarket-backend-bb524c4ea0b6.herokuapp.com/check-verification-status?userId=${userId}`);
                if (response.data.verified) {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error al verificar el estado de verificación:', error);
            }
        };

        const intervalId = setInterval(checkVerificationStatus, 5000); // Polling cada 5 segundos

        return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
    }, [userId, navigate]);

    return (
        <>
            <div className="title__product">
                <TitlePage />
            </div>
            <div className="verification">
                <div className="verification__info">
                    <h1>¡Enlace enviado a {user.email}!</h1>
                    <p>Entra a tu correo electrónico y haz click en el botón de verificación para asegurarnos que el correo electrónico es tuyo.</p>
                </div>
                <img src={vendedor} />
            </div>
        </>
    );
};

export default Verification;
