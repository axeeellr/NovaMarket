import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import '../css/notifications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSignOut, faCartPlus, faTruckFast, faHandshake, faArrowCircleLeft, faBagShopping, faGear, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';

function Notifications() {
    const [isVisible, setIsVisible] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const notificationsRef = useRef(null);

    const handleClickOutside = (event) => {
        if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
            setIsVisible(false);
        }
    };

    const iconsMap = {
        'edit': faEdit,
        'trash': faTrash,
        'plus': faPlus,
        'signOut': faSignOut,
        'cartPlus': faCartPlus,
        'truckFast': faTruckFast,
        'handshake': faHandshake,
        'arrowCircleLeft': faArrowCircleLeft,
        'bagShopping': faBagShopping,
        'gear': faGear,
        'user': faUser,
        'heart': faHeart
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('https://novamarket-backend-bb524c4ea0b6.herokuapp.com/notifications');
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error('Error al obtener notificaciones:', error);
            }
        };

        fetchNotifications();

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="notifications" ref={notificationsRef}>
            <div className="notifications__container">
                <h2>Notificaciones</h2>
                {notifications.map((notification) => (
                    <div className="notification" key={notification.id}>
                        <FontAwesomeIcon className='notification__icon' icon={iconsMap[notification.icon]} />
                        <div className="notification__text">
                            <h3>{notification.title}</h3>
                            <p>{notification.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notifications;
