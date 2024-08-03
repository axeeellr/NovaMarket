import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';
import '../css/adminnotifications.css';

const initialNotifications = [
    { id: 1, title: 'Mantenimiento programado', message: 'El sistema estará en mantenimiento el próximo sábado.' },
    { id: 2, title: 'Nueva funcionalidad', message: 'Se ha añadido una nueva funcionalidad a la aplicación.' }
    // Agrega más notificaciones predeterminadas según sea necesario
];

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [publishedNotifications, setPublishedNotifications] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newMessage, setNewMessage] = useState('');

    const handleTitleChange = (e) => setNewTitle(e.target.value);
    const handleMessageChange = (e) => setNewMessage(e.target.value);

    const handleAddNotification = (e) => {
        e.preventDefault();
        const newNotification = {
            id: notifications.length + 1,
            title: newTitle,
            message: newMessage
        };
        setNotifications([...notifications, newNotification]);
        setNewTitle('');
        setNewMessage('');
    };

    const handlePublishNotification = (notification) => {
        setPublishedNotifications([...publishedNotifications, notification]);
    };

    const handleDeleteNotification = (id, type) => {
        if (type === 'default') {
            setNotifications(notifications.filter(notification => notification.id !== id));
        } else if (type === 'published') {
            setPublishedNotifications(publishedNotifications.filter(notification => notification.id !== id));
        }
    };

    return (
        <>
        <div className="admin__header">
            <h1>Gestión de notificaciones de NovaMarket</h1>
            <button>Cerrar Sesión<FontAwesomeIcon icon={faSignOut}/></button>
        </div>
        <div className="admin-notifications">
            <div className="notifications-list">
                <h2>Notificaciones Predeterminadas</h2>
                <ul>
                    {notifications.map(notification => (
                        <li key={notification.id}>
                            <h3>{notification.title}</h3>
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
                    <button type="submit">Publicar</button>
                </form>
            </div>
            <div className="published-notifications">
                <h2>Notificaciones Publicadas</h2>
                <ul>
                    {publishedNotifications.map(notification => (
                        <li key={notification.id}>
                            <h3>{notification.title}</h3>
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
