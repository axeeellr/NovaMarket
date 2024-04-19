import React from 'react'
import '../css/root.css'
import '../css/login.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';

function Login() {
    return (
        <div className="main">  	
            <input type="checkbox" id="chk" aria-hidden="true" />
            <div className="signup">
                <form>
                    <label htmlFor="chk" aria-hidden="true">Registro</label>
                    <div className="inputs">
                        <input type="text" name="txt" placeholder="Nombre" required />
                        <input type="email" name="email" placeholder="Correo electrónico" required />
                        <input type="password" name="pswd" placeholder="Contraseña" required />
                        <button>Entrar</button>
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
                <form>
                    <label htmlFor="chk" aria-hidden="true">Iniciar Sesión</label>
                    <div className="inputs">
                        <input type="email" name="email" placeholder="Correo electrónico" required />
                        <input type="password" name="pswd" placeholder="Contraseña" required />
                        <button>Entrar</button>
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

