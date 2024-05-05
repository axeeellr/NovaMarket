import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    const handleLogin = () => {
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

    const handleRegistro = () => {
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
        <div className="main">  	
            <input type="checkbox" id="chk" aria-hidden="true" />
            <div className="signup">
                <form method="post">
                    <label htmlFor="chk" aria-hidden="true"><Link to="/"><FontAwesomeIcon icon={faArrowCircleLeft} className='title__icon__login'/></Link>Registro</label>
                    <div className="inputs">
                        <input type="text" name="txt" placeholder="Nombre" value={registroNombre} onChange={(e) => setRegistroNombre(e.target.value)} required />
                        <input type="email" name="email" placeholder="Correo electrónico" value={registroEmail} onChange={(e) => setRegistroEmail(e.target.value)} required />
                        <input type="password" name="pswd" placeholder="Contraseña" value={registroPassword} onChange={(e) => setRegistroPassword(e.target.value)} required />
                        <button type="button" onClick={handleRegistro}>Registrar</button>
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
                <form method="post">
                    <label htmlFor="chk" aria-hidden="true"><Link to="/"><FontAwesomeIcon icon={faArrowCircleLeft} className='title__icon__login'/></Link>Iniciar Sesión</label>
                    <div className="inputs">
                        <input type="email" name="email" placeholder="Correo electrónico" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                        <input type="password" name="pswd" placeholder="Contraseña" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                        <button type="button" onClick={handleLogin}>Entrar</button>
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
    );
}

export default Login;
