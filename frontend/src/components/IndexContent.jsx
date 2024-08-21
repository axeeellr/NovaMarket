import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/content.css';

function IndexContent() {
    const [currentStep, setCurrentStep] = useState(0); // Comienza en el paso 0

    const steps = [
        { title: "Escanea los productos", description: "Escanea el código QR de los productos que quieres comprar" },
        { title: "Añade los productos al carrito", description: "Haz clic en añadir al carrito hasta que termines con tu compra. Luego, no olvides poner un nombre al carrito que ayude a identificarlo mejor en tu historial." },
        { title: "Selecciona un método de pago", description: "Selecciona el método de pago que prefieras junto con sus datos, recuerda que tus datos están seguros" },
        { title: "Completa tu compra", description: "Verifica todos los productos y completa tu compra." },
        { title: "Revisa tu factura", description: "Revisa la factura que enviamos a tu correo y disfruta de tu compra" }
    ];

    const handleStepClick = (index) => {
        setCurrentStep(index);
    };

    return (
        <div className="content">
            <div className="content__infoScanner">
                <div className="content__img">
                    <img src="https://storage.googleapis.com/support-kms-prod/mQmcrC93Ryi2U4x5UdZNeyHQMybbyk71yCVm" alt="Escanea tus productos" />
                </div>
                <div className="content__info">
                    <h3>Empieza a escanear</h3>
                    <p>Añade tus productos al carrito escaneando el código QR de cada uno.</p>
                    <Link to="/scanner" style={{ textDecoration: 'none' }}>
                        <button>ESCANEAR</button>
                    </Link>
                </div>
            </div>
            <div className="content__infoStep">
                <h3>¿Cómo comprar?</h3>
                <ul className="StepProgress">
                    {steps.map((step, index) => (
                        <li 
                            key={index} 
                            className={`StepProgress-item ${index < currentStep ? 'is-done' : ''} ${index === currentStep ? 'current' : ''}`}
                            onClick={() => handleStepClick(index)} // Hacer clic para cambiar de paso
                            style={{ cursor: 'pointer' }}
                        >
                            <h3>{step.title}</h3>
                            {index === currentStep && (
                                <p className="StepDescription">{step.description}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default IndexContent;
