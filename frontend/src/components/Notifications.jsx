// Notifications.jsx
import React from 'react';
import '../css/notifications.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faCartPlus, faTruckFast, faHandshake, faArrowCircleLeft, faBagShopping } from '@fortawesome/free-solid-svg-icons';

function Notifications() {
  return (
        <div className="notifications">
            <div className="notifications__container">
                <h1>Nuevas</h1>
                <div className="notification">
                    <FontAwesomeIcon className='notification__icon' icon={faCartPlus}/>
                    <div className="notification__text">
                        <h3>¡Hay nuevos productos añadidos en el pasillo 3!</h3>
                        <p>Hace 8 minutos</p>
                    </div>
                    <div className="notification__options">
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </div>
                </div>
                <div className="notification opened">
                    <FontAwesomeIcon className='notification__icon' icon={faTruckFast}/>
                    <div className="notification__text">
                        <h3>Su compra se encuentra en camino</h3>
                        <p>Hace 32 minutos</p>
                    </div>
                    <div className="notification__options">
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </div>
                </div>
                <div className="notification">
                    <FontAwesomeIcon className='notification__icon' icon={faHandshake}/>
                    <div className="notification__text">
                        <h3>Su compra fue recibido con éxito</h3>
                        <p>Hace 2 h</p>
                    </div>
                    <div className="notification__options">
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </div>
                </div>
            </div>


            <div className="notifications__container">
                <h1>Anteriores</h1>
                <div className="notification">
                    <FontAwesomeIcon className='notification__icon' icon={faBagShopping}/>
                    <div className="notification__text">
                        <h3>Su compra ha sido entregada. ¡Gracias por preferirnos!</h3>
                        <p>Hace 3 días</p>
                    </div>
                    <div className="notification__options">
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </div>
                </div>
                <div className="notification">
                    <FontAwesomeIcon className='notification__icon' icon={faTruckFast}/>
                    <div className="notification__text">
                        <h3>Su compra se encuentra en camino</h3>
                        <p>Hace 32 minutos</p>
                    </div>
                    <div className="notification__options">
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </div>
                </div>
                <div className="notification opened">
                    <FontAwesomeIcon className='notification__icon' icon={faHandshake}/>
                    <div className="notification__text">
                        <h3>Su compra fue recibido con éxito</h3>
                        <p>Hace 1 hora</p>
                    </div>
                    <div className="notification__options">
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notifications;
