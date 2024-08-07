import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import { useUser } from '../UserContext';
import { encryptData } from '../CryptoUtils';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faTwitter} from '@fortawesome/free-brands-svg-icons';
import { faArrowCircleLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../css/root.css';
import '../css/login.css';

function Login() {
    const { user } = useUser();
    const navigate = useNavigate();
    const { login } = useUser();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registroNombre, setRegistroNombre] = useState('');
    const [registroEmail, setRegistroEmail] = useState('');
    const [registroPassword, setRegistroPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };

    useEffect(() => {
        const checkVerificationStatus = async () => {
            if (user) {
                const userId = user.id;
                try {
                    const response = await axios.get(`http://localhost:1001/check-verification-status?userId=${userId}`);
                    if (!response.data.verified) {
                        localStorage.removeItem('firstVisit');
                        localStorage.removeItem('user');
                        localStorage.removeItem('isAuthenticated');
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Error al verificar el estado de verificación:', error);
                }
            }
        };
    
        checkVerificationStatus();
    }, []);
    

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(loginEmail)) {
            toast('¡Correo electrónico no válido!');
            return;
        }

        if (!validatePassword(loginPassword)) {
            toast('¡La contraseña requiere al menos 8 caracteres con números y letras!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:1001/login', { email: loginEmail, password: loginPassword });
            const user = response.data.user;
            login(user);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            toast('¡Datos incorrectos!');
        }
    };

    const handleRegistro = async (e) => {
        e.preventDefault();

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

        const encryptedPassword = encryptData(registroPassword);

        try {
            const response = await axios.post('http://localhost:1001/registro', { name: registroNombre, email: registroEmail, password: encryptedPassword });
            const user = response.data.user;
            login(user);
            navigate('/verification'); // Redirige a la página de verificación
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.error === 'El correo electrónico ya está registrado') {
                toast('¡El correo electrónico ya está registrado!');
            } else {
                toast('Error al registrar usuario');
            }
        }
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
                        <div className="inputPassword">
                            <input type={showPassword ? "text" : "password"} name="pswd" placeholder="Contraseña" value={registroPassword} onChange={(e) => setRegistroPassword(e.target.value)} required />
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={togglePasswordVisibility} className="password-toggle-icon" />
                        </div>
                        <input type="submit" value="REGISTRO"/>
                    </div>
                    <p className='socialTextSign'>También puedes usar</p>
                    <div className="social">
                        <FontAwesomeIcon icon={faGoogle} className='socialIcon'/>
                        <FontAwesomeIcon icon={faFacebook} className='socialIcon'/>
                        <FontAwesomeIcon icon={faTwitter} className='socialIcon'/>
                    </div>
                </form>
            </div>
            <div className="login">
                <form method="post" onSubmit={handleLogin}>
                    <label htmlFor="chk" aria-hidden="true"><Link to="/"><FontAwesomeIcon icon={faArrowCircleLeft} className='title__icon__login'/></Link>Iniciar Sesión</label>
                    <div className="inputs inputsLogin">
                        <input type="email" name="email" placeholder="Correo electrónico" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                        <div className="inputPassword">
                            <input type={showPassword ? "text" : "password"} name="pswd" placeholder="Contraseña" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={togglePasswordVisibility} className="password-toggle-icon" />
                        </div>
                        <input type="submit" value="INICIAR"/>
                    </div>
                    <p className='socialTextLogin'>También puedes usar</p>
                    <div className="social">
                        <FontAwesomeIcon icon={faGoogle} className='socialIcon'/>
                        <FontAwesomeIcon icon={faFacebook} className='socialIcon'/>
                        <FontAwesomeIcon icon={faTwitter} className='socialIcon'/>
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
                    textAlign: 'center',
                    fontSize: '15px'
                },
            }}
        />
        </>
    );
}

export default Login;
