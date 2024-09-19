import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import '../css/adminchat.css';

const socket = io.connect('https://novamarket.onrender.com');

const AdminChat = () => {
    
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [message, setMessage] = useState('');

    const chatAdminEndRef = useRef(null); // Referencia al final del chat

    useEffect(() => {
        // Obtener la lista de usuarios
        fetch('https://novamarket.onrender.com/chats/users')
            .then((res) => res.json())
            .then((data) => setUsers(data));
    }, []);

    useEffect(() => {
        // Si hay un usuario seleccionado, suscribirse al evento de mensajes
        if (currentUser) {
            // Limpiar cualquier listener anterior para evitar duplicados
            socket.off('receive_message');
            
            // Escuchar nuevos mensajes para el usuario seleccionado
            socket.on('receive_message', (data) => {
                if (data.sender_id === currentUser.id || data.receiver_id === currentUser.id) {
                    setMessages((prevMessages) => [...prevMessages, data]);
                }
            });

            // Limpiar el listener cuando el componente o el usuario cambia
            return () => socket.off('receive_message');
        }
    }, [currentUser]);

    // Efecto para desplazarse automáticamente al final del chat cuando los mensajes cambian
    useEffect(() => {
        chatAdminEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [messages]);

    // Selección de usuario
    const selectUser = (user) => {
        setCurrentUser(user);

        // Obtener historial de mensajes del usuario seleccionado
        fetch(`https://novamarket.onrender.com/chats/${user.id}`)
            .then((res) => res.json())
            .then((data) => setMessages(data));
    };

    // Enviar mensaje
    const sendMessage = (e) => {
        e.preventDefault();
        if (currentUser && message.trim()) {
            const adminId = 1; // ID del administrador
            socket.emit('send_message', { sender_id: adminId, receiver_id: currentUser.id, content: message });
            setMessage('');
        }
    };

    return (
        <div className="admin__chat">
            <div className="admin__chat__selection">
                {users.map((user) => (
                    <div key={user.id} className="chat__selection" onClick={() => selectUser(user)}>
                        <h2>{user.name}</h2>
                        <p>Haz click para entrar...</p>
                    </div>
                ))}
            </div>

                <div className='admin__chat__container'>
                    <div className="admin__chat__header">
                        <h2>{currentUser ? currentUser.name : 'Selecciona un usuario'}</h2>
                    </div>
                    <div className="admin__chat__content">
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.sender_id === 1 ? 'admin__message__sent' : 'admin__message__received'}>
                                <div className="admin__message__content">
                                    <p>{msg.content}</p>
                                </div>
                                <p className='admin__message__time'>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        ))}
                        <div ref={chatAdminEndRef}></div>
                    </div>
                    <div className="admin__chat__writer">
                        <form onSubmit={sendMessage}>
                            <input type="text" placeholder='Mensaje...' value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button type="submit"><FontAwesomeIcon icon={faPaperPlane} /></button>
                        </form>
                    </div>
                </div>
 
        </div>
    );
};

export default AdminChat;
