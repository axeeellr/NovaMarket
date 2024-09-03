import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSignOut, faEllipsis, faCartPlus, faTruckFast, faHandshake, faArrowCircleLeft, faBagShopping, faGear, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../css/adminnotifications.css';

import AdminHeader from '../components/HeaderAdmin';

// Lista de íconos FontAwesome para las notificaciones
const icons = [
    faEdit,
    faTrash,
    faPlus,
    faSignOut,
    faCartPlus,
    faTruckFast,
    faHandshake,
    faArrowCircleLeft,
    faBagShopping,
    faGear,
    faUser,
    faHeart,

];

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [publishedNotifications, setPublishedNotifications] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(icons[0]);

    useEffect(() => {
        // Cargar notificaciones iniciales (predeterminadas) si es necesario
        setNotifications([
            { id: 1, title: 'Mantenimiento programado', message: 'El sistema estará en mantenimiento el próximo sábado.', icon: faEdit },
            { id: 2, title: 'Nueva funcionalidad', message: 'Se ha añadido una nueva funcionalidad a la aplicación.', icon: faTrash }
        ]);

        // Cargar notificaciones publicadas desde la base de datos
        const fetchPublishedNotifications = async () => {
            try {
                const response = await axios.get('https://novamarket.onrender.com/published-notifications');
                setPublishedNotifications(response.data.notifications);
            } catch (error) {
                console.error('Error al cargar notificaciones publicadas:', error);
            }
        };

        fetchPublishedNotifications();
    }, []);

    const handleTitleChange = (e) => setNewTitle(e.target.value);
    const handleMessageChange = (e) => setNewMessage(e.target.value);
    const handleIconChange = (icon) => setSelectedIcon(icon);

    const handleAddNotification = async (e) => {
        e.preventDefault();
        const newNotification = {
            id: notifications.length + 1,
            title: newTitle,
            message: newMessage,
            icon: selectedIcon
        };
        setNotifications([...notifications, newNotification]);
        setNewTitle('');
        setNewMessage('');

        try {
            await axios.post('https://novamarket.onrender.com/publish-notification', {
                title: newNotification.title,
                message: newNotification.message,
                icon: newNotification.icon.iconName
            });
        } catch (error) {
            console.error('Error al guardar la notificación en la base de datos:', error);
        }
    };

    const handlePublishNotification = (notification) => {
        setPublishedNotifications([...publishedNotifications, notification]);
    };

    const handleDeleteNotification = async (id, type) => {
        if (type === 'default') {
            setNotifications(notifications.filter(notification => notification.id !== id));
        } else if (type === 'published') {
            setPublishedNotifications(publishedNotifications.filter(notification => notification.id !== id));
            
            try {
                await axios.delete(`https://novamarket.onrender.com/delete-notification/${id}`);
            } catch (error) {
                console.error('Error al eliminar la notificación:', error);
            }
        }
    };

    return (
        <>
            <AdminHeader/>
            <div className="admin-notifications">
                <div className="notifications-list">
                    <h2>Notificaciones Predeterminadas</h2>
                    <ul>
                        {notifications.map(notification => (
                            <li key={notification.id}>
                                <div className="title-notifications">
                                    <FontAwesomeIcon icon={notification.icon} />
                                    <h3>{notification.title}</h3>
                                </div>
                                <p>{notification.message}</p>
                                <button onClick={() => handlePublishNotification(notification)}>Publicar</button>
                                <button onClick={() => handleDeleteNotification(notification.id, 'default')}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="notification-form">
                    <h2>Crear Nueva Notificación</h2>
                    <form onSubmit={handleAddNotification}>
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={handleTitleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mensaje</label>
                            <textarea
                                value={newMessage}
                                onChange={handleMessageChange}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Ícono</label>
                            <div className="icon-selector">
                                {icons.map((icon, index) => (
                                    <FontAwesomeIcon
                                        key={index}
                                        icon={icon}
                                        className={`icon ${icon === selectedIcon ? 'selecteded' : ''}`}
                                        onClick={() => handleIconChange(icon)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className=""></div>
                        <button type="submit">Añadir Notificación</button>
                    </form>
                </div>
                <div className="published-notifications">
                    <h2>Notificaciones Publicadas</h2>
                    <ul>
                        {publishedNotifications.map(notification => (
                            <li key={notification.id}>
                                <div className="title-notifications">
                                    <FontAwesomeIcon icon={notification.icon} />
                                    <h3>{notification.title}</h3>
                                </div>
                                <p>{notification.message}</p>
                                <button onClick={() => handleDeleteNotification(notification.id, 'published')}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default AdminNotifications;
