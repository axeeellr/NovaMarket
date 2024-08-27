import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/notfound.css'; // Asegúrate de tener este archivo CSS en el mismo directorio

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="not-found">
            <h1>404</h1>
            <p>Lo sentimos, la página que estás buscando no existe.</p>
            <button onClick={handleGoHome}>Volver al inicio</button>
        </div>
    );
};

export default NotFound;
