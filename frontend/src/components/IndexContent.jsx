import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/content.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCircleInfo, faCaretUp } from '@fortawesome/free-solid-svg-icons'; // Añadir iconos

function IndexContent() {
    const [currentStep, setCurrentStep] = useState(0); // Comienza en el paso 0
    const [isFooterVisible, setFooterVisible] = useState(false); // Estado para controlar visibilidad del footer

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

    const toggleFooter = () => {
        setFooterVisible(!isFooterVisible); // Alterna la visibilidad del footer
    };

    return (
        <div className="content">
            <div className="content__infoScanner">
                <div className="content__img">
                    <img src="https://storage.googleapis.com/support-kms-prod/mQmcrC93Ryi2U4x5UdZNeyHQMybbyk71yCVm" alt="Escanea tus productos" />
                </div>
                <div className="content__info">
                    <h3>¡Empieza a escanear!</h3>
                    <p>Añade tus productos al carrito escaneando el código QR de cada uno.</p>
                    <Link to="/scanner" style={{ textDecoration: 'none' }}>
                        <button>ESCANEAR</button>
                    </Link>
                </div>
            </div>
            <div className="content__infoStep">
                <h2>¿Cómo comprar?</h2>
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

            <button onClick={toggleFooter} className="toggle-footer-button">
                <FontAwesomeIcon icon={isFooterVisible ? faCaretUp : faCircleInfo} />
            </button>

            <footer className={isFooterVisible ? 'show' : ''}>
                <div className="footer__top">
                    <div className="footer__about">
                        <h2>Sobre Nosotros</h2>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi eveniet eaque animi, cupiditate totam et fugit, expedita rem, debitis tempore reiciendis ullam optio? Consequuntur voluptatibus ipsum accusantium veritatis laudantium iste est eius? Ullam provident iusto, minima temporibus.</p>
                    </div>
                    <div className="footer__categories">
                        <h2>Integrantes</h2>
                        <p>Abner Navarro</p>
                        <p>Jasmín Flores</p>
                        <p>Axel Ramírez</p>
                        <p>René Cornejo</p>
                    </div>
                    <div className="footer__links">
                        <h2>Enlaces</h2>
                        <p>Acerda de</p>
                        <p>Contáctanos</p>
                        <p>Política de privacidad</p>
                    </div>
                </div>
                <div className="footer__bottom">
                    <div className="footer__copy">
                        <p>Copyright &copy; 2024 Todos los derechos reservados por NovaMarket</p>
                    </div>
                    <div className="footer__media">
                        <FontAwesomeIcon icon={faFacebook} />
                        <FontAwesomeIcon icon={faInstagram} />
                        <FontAwesomeIcon icon={faLinkedin} />
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default IndexContent;
