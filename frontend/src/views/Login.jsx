import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

import { useUser } from '../UserContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

import '../css/root.css';
import '../css/login.css';

function Login() {

    const navigate = useNavigate();
    const { login } = useUser();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    const [registroNombre, setRegistroNombre] = useState('');
    const [registroEmail, setRegistroEmail] = useState('');
    const [registroPassword, setRegistroPassword] = useState('');

    const validateEmail = (email) => {
        // Utilizamos una expresión regular para validar el formato del correo electrónico
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        // Validamos que la contraseña tenga al menos 8 caracteres y contenga al menos un número y una letra
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };



    const handleLogin = async (e) => {
        e.preventDefault()

        if (!validateEmail(loginEmail)) {
            toast('¡Correo electrónico no válido!');
            return;
        }

        if (!validatePassword(loginPassword)) {
            toast('¡La contraseña requiere al menos 8 caracteres con números y letras!');
            return;
        }

        axios.post('http://localhost:1001/login', { email: loginEmail, password: loginPassword })
        .then(response => {
            const user = response.data.user;
            login(user);
            navigate('/');
        })
        .catch(error => {
            console.error(error);
        });
    };

    const handleRegistro = async (e) => {
        e.preventDefault()

        if (!registroNombre.trim()) {
            toast('¡El nombre es obligatorio!');
            return;
        }

        if (!validateEmail(registroEmail)) {
            toast('¡Correo electrónico no válido!');
            return;
        }
        
        if (!validatePassword(registroPassword)) {
            toast('¡La contraseña requiere al menos 8 caracteres con números y letras!');
            return;
        }

        axios.post('http://localhost:1001/registro', { name: registroNombre, email: registroEmail, password: registroPassword })
        .then(response => {
            const user = response.data.user;
            login(user);
            navigate('/');
        })
        .catch(error => {
            console.error(error);
        });
    };

    return (
        <>
        <div className="main">  	
            <input type="checkbox" id="chk" aria-hidden="true" />
            <div className="signup">
                <form method="post" onSubmit={handleRegistro}>
                    <label htmlFor="chk" aria-hidden="true"><Link to="/"><FontAwesomeIcon icon={faArrowCircleLeft} className='title__icon__login'/></Link>Registro</label>
                    <div className="inputs">
                        <input type="text" name="txt" placeholder="Nombre" value={registroNombre} onChange={(e) => setRegistroNombre(e.target.value)} required />
                        <input type="email" name="email" placeholder="Correo electrónico" value={registroEmail} onChange={(e) => setRegistroEmail(e.target.value)} required />
                        <input type="password" name="pswd" placeholder="Contraseña" value={registroPassword} onChange={(e) => setRegistroPassword(e.target.value)} required />
                        <input type="submit" value="Registro"/>
                    </div>
                    <p className='socialTextSign'>También puedes usar...</p>
                    <div className="social">
                        <FontAwesomeIcon icon={faGoogle} />
                        <FontAwesomeIcon icon={faFacebook} />
                        <FontAwesomeIcon icon={faTwitter} />
                    </div>
                </form>
            </div>
            <div className="login">
                <form method="post" onSubmit={handleLogin}>
                    <label htmlFor="chk" aria-hidden="true"><Link to="/"><FontAwesomeIcon icon={faArrowCircleLeft} className='title__icon__login'/></Link>Iniciar Sesión</label>
                    <div className="inputs">
                        <input type="email" name="email" placeholder="Correo electrónico" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                        <input type="password" name="pswd" placeholder="Contraseña" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                        <input type="submit" value="Iniciar Sesión"/>
                    </div>
                    <p className='socialTextLogin'>También puedes usar...</p>
                    <div className="social">
                        <FontAwesomeIcon icon={faGoogle} />
                        <FontAwesomeIcon icon={faFacebook} />
                        <FontAwesomeIcon icon={faTwitter} />
                    </div>
                </form>
            </div>
        </div>

        <Toaster
            toastOptions={{
                duration: 3000,
                style: {
                    background: '#C5B28A',
                    color: '#193E4E',
                    textAlign: 'center'
                },
            }}
        />
        </>
    );
}

export default Login;
