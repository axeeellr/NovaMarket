import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import '../css/admin.css';

const Address = () => {
    return(
        <>
        <div className="admin__container">
            <div className="admin__header">
                <h1>Panel de Administración</h1>
                <button>Cerrar Sesión<FontAwesomeIcon icon={faSignOut}/></button>
            </div>
            <div className="admin__content">
                <div className="adminContent contentUser">
                    <div className="content__icon">
                        <FontAwesomeIcon icon={faSignOut}/>
                    </div>
                    <div className="content__text">
                        <h1>Gestión de usuarios</h1>
                    </div>
                </div>
                <div className="adminContent contentProducts">
                    <div className="content__icon">
                        <FontAwesomeIcon icon={faSignOut}/>
                    </div>
                    <div className="content__text">
                        <h1>Gestión de productos</h1>
                    </div>
                </div>
                <div className="adminContent contentChats">
                    <div className="content__icon">
                        <FontAwesomeIcon icon={faSignOut}/>
                    </div>
                    <div className="content__text">
                        <h1>Chat</h1>
                    </div>
                </div>
                <div className="adminContent contentSales">
                    <div className="content__icon">
                        <FontAwesomeIcon icon={faSignOut}/>
                    </div>
                    <div className="content__text">
                        <h1>Compras</h1>
                    </div>
                </div>
                <div className="adminContent contentDeliverys">
                    <div className="content__icon">
                        <FontAwesomeIcon icon={faSignOut}/>
                    </div>
                    <div className="content__text">
                        <h1>Pedidos</h1>
                    </div>
                </div>
                <div className="adminContent contentNotifications">
                    <div className="content__icon">
                        <FontAwesomeIcon icon={faSignOut}/>
                    </div>
                    <div className="content__text">
                        <h1>Notificaciones</h1>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
};

export default Address;
