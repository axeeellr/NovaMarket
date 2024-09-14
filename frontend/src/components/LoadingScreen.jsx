import React from 'react';
import '../css/loadingscreen.css'; // Asegúrate de definir estilos para tu pantalla de carga

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingScreen;
