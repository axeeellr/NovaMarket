import React from 'react'
import '../css/root.css'
import '../css/login.css'

function Login() {
    return (
        <div className="body">
            <div className="main">  	
                <input type="checkbox" id="chk" aria-hidden="true" />
                <div className="signup">
                    <form>
                        <label htmlFor="chk" aria-hidden="true">Registro</label>
                        <input type="text" name="txt" placeholder="Nombre" required />
                        <input type="email" name="email" placeholder="Correo electrónico" required />
                        <input type="password" name="pswd" placeholder="Contraseña" required />
                        <button>Entrar</button>
                    </form>
                </div>
                <div className="login">
                    <form>
                        <label htmlFor="chk" aria-hidden="true">Iniciar sesión</label>
                        <input type="email" name="email" placeholder="Correo electrónico" required />
                        <input type="password" name="pswd" placeholder="Contraseña" required />
                        <button>Entrar</button>
                    </form>
                </div>
            </div>
        </div>
	);
}

export default Login;