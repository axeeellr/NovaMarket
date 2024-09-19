import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCaretUp, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import '../css/content.css'; // Asegúrate de tener este archivo de estilos para el footer

function Footer({ isFooterVisible, toggleFooter, className }) {
    return (
        <>
            <button onClick={toggleFooter} className="toggle-footer-button">
                <FontAwesomeIcon icon={isFooterVisible ? faCaretUp : faCircleInfo} />
            </button>
            <footer className={`${isFooterVisible ? 'show' : ''} ${className}`}>
                <div className="footer__top">
                    <div className="footer__about">
                        <h2>Sobre Nosotros</h2>
                        <p>NovaMarket es la solución al dilema entre las necesidades de los usuarios y la realidad de las compras de supermercado. Con NovaMarket puedes escanear los productos a comprar, crear tu propio carrito de compras virtual, tienda online, atención personalizada y más. Hacer filas y pasar un mal momento nunca volverá a ser parte de tu vida.</p>
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
        </>
    );
}

export default Footer;
