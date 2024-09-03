import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

import { useUser } from '../UserContext';

import TitlePage from '../components/TitlePage';
const vendedor = 'https://novamarket-img.s3.us-east-2.amazonaws.com/vendedor.png';
import '../css/verification.css';

const Verification = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const userId = user.id;
    const [code, setCode] = useState(['', '', '', '']); // Almacena los dígitos del código

    const handleChange = (index, value) => {
        if (value.match(/^[0-9]$/)) { // Solo permitir números
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Mover al siguiente input automáticamente si hay un valor
            if (value && index < 3) {
                document.getElementById(`code-input-${index + 1}`).focus();
            }
        }
    };

    const handleSubmit = async () => {
        const verificationCode = code.join('');
        try {
            const response = await axios.post('https://novamarket.onrender.com/verify-code', {
                userId,
                verificationCode,
            });
            if (response.data.verified) {
                navigate('/');
            } else {
                toast.error('¡Código incorrecto!');
            }
        } catch (error) {
            console.error('Error al verificar el código:', error);
        }
    };

    return (
        <>
            <div className="title__product">
                <TitlePage />
            </div>
            <div className="verification">
                <div className="verification__info" id="wrapper">
                    <h2>Código enviado a "{user.email}"</h2>
                    <p>Entra a tu correo electrónico y escribe el código de 4 dígitos que se ha enviado.</p>
                    <div id="form">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                id={`code-input-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                size="1"
                                min="0"
                                max="9"
                                pattern="[0-9]{1}"
                            />
                        ))}
                        <button className="btn btn-primary btn-embossed" onClick={handleSubmit}>
                            Verificar
                        </button>
                    </div>
                </div>
                <img src={vendedor} alt="Vendedor" />
            </div>

            <Toaster
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#C5B28A',
                        color: '#193E4E',
                        textAlign: 'center',
                        fontSize: '15px'
                    },
                }}
            />
        </>
    );
};

export default Verification;
