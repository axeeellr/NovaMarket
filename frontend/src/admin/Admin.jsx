import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faUsers, faBowlRice, faComments, faCartArrowDown, faTruckFast, faBell } from '@fortawesome/free-solid-svg-icons';
import '../css/admin.css';

const Admin = () => {
    return (
        <div className="admin__container">
            <div className="admin__header">
                <h1>Panel de Administración</h1>
                <button>Cerrar Sesión<FontAwesomeIcon icon={faSignOut} /></button>
            </div>
            <div className="admin__content">
                <Link to="/adminusers" className="content__item contentUser">
                    <div className="item__icon">
                        <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div className="item__text">
                        <h1>Gestión de usuarios</h1>
                    </div>
                </Link>
                <Link to="/adminproducts" className="content__item contentProducts">
                    <div className="item__icon">
                        <FontAwesomeIcon icon={faBowlRice} />
                    </div>
                    <div className="item__text">
                        <h1>Gestión de productos</h1>
                    </div>
                </Link>
                <Link to="/adminchat" className="content__item contentChats">
                    <div className="item__icon">
                        <FontAwesomeIcon icon={faComments} />
                    </div>
                    <div className="item__text">
                        <h1>Chat</h1>
                    </div>
                </Link>
                <Link to="/adminsales" className="content__item contentSales">
                    <div className="item__icon">
                        <FontAwesomeIcon icon={faCartArrowDown} />
                    </div>
                    <div className="item__text">
                        <h1>Compras</h1>
                    </div>
                </Link>
                <Link to="/admindelivery" className="content__item contentDeliverys">
                    <div className="item__icon">
                        <FontAwesomeIcon icon={faTruckFast} />
                    </div>
                    <div className="item__text">
                        <h1>Pedidos</h1>
                    </div>
                </Link>
                <Link to="/adminnotifications" className="content__item contentNotifications">
                    <div className="item__icon">
                        <FontAwesomeIcon icon={faBell} />
                    </div>
                    <div className="item__text">
                        <h1>Notificaciones</h1>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Admin;
