import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faPaperPlane, faImages } from '@fortawesome/free-solid-svg-icons';
const vendedor = 'https://novamarket-img.s3.us-east-2.amazonaws.com/vendedor.png';
import '../css/fruits.css';

// Supongamos que tienes un contexto de usuario para obtener el ID del usuario.
import { useUser } from '../UserContext';

const socket = io.connect('https://novamarketbackend.onrender.com');

const Chat = () => {
    const [chatVisible, setChatVisible] = useState(false);
    const [thumbnailVisible, setThumbnailVisible] = useState(true);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const { user } = useUser(); // Obtén el usuario del contexto
    const userId = user.id; // Asumiendo que el contexto tiene un campo `id`
    
    const chatEndRef = useRef(null); // Referencia al final del chat

    useEffect(() => {
        // Obtener historial de mensajes desde el backend cuando el componente se monta
        fetch(`https://novamarketbackend.onrender.com/chats/${userId}`)
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error('Error al cargar mensajes:', err));

        // Escuchar nuevos mensajes desde el servidor
        socket.on('receive_message', (data) => {
            // Solo agregar el mensaje si pertenece a la conversación del usuario actual
            if (data.sender_id !== userId) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        });

        // Limpiar el listener cuando el componente se desmonta
        return () => socket.off('receive_message');
    }, [userId]);

    // Efecto para desplazarse automáticamente al final del chat cuando los mensajes cambian
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [messages]);

    const toggleChatVisibility = () => {
        setChatVisible(!chatVisible);
        setThumbnailVisible(!thumbnailVisible);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const receiverId = 1; // ID del administrador
    
            // Crear el objeto del mensaje a enviar
            const newMessage = {
                sender_id: userId,
                receiver_id: receiverId,
                content: message,
                timestamp: new Date().toISOString() // Añadimos una marca de tiempo local
            };
    
            // Emitir el mensaje al servidor
            socket.emit('send_message', newMessage);
    
            // Actualizar los mensajes localmente sin esperar al servidor
            setMessages((prevMessages) => [...prevMessages, newMessage]);
    
            // Limpiar el input
            setMessage('');
        }
    };    

    useEffect(() => {
        const chatVisible = localStorage.getItem('chatVisible') === 'true';
        if (chatVisible) {
            setTimeout(() => {
                setChatVisible(true);
                localStorage.removeItem('chatVisible'); // Limpia el estado después de usarlo
            }, "1000");
        }
    }, []);
    

    // Función para formatear la fecha en formato "DD/MM"
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <>
            <div className={`chat__thumbnail ${thumbnailVisible && !chatVisible ? 'visible' : ''}`} onClick={toggleChatVisibility}>
                <img src={vendedor} />
                <p>1</p>
            </div>
            <div className={`chat__container ${chatVisible ? 'visible' : ''}`}>
                <div className="chat__header">
                    <div className="chat__header__info">
                        <img src={vendedor} />
                        <h2>Don Mario</h2>
                    </div>
                    <FontAwesomeIcon icon={faSortDown} className='chat__close' onClick={toggleChatVisibility} />
                </div>
                <div className="chat__content">
                    {messages.map((msg, index) => {
                        const showDate = index === 0 || formatDate(msg.timestamp) !== formatDate(messages[index - 1]?.timestamp);

                        return (
                            <div key={index}>
                                {/* Mostrar la fecha si es el primer mensaje o si cambia la fecha respecto al mensaje anterior */}
                                {showDate && <div className="chat__date">{formatDate(msg.timestamp)}</div>}
                                <div className={msg.sender_id === userId ? 'message__sent' : 'message__received'}>
                                    <div className="message__received__content">
                                        <p>{msg.content}</p>
                                    </div>
                                    <p className='message__time'>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        );
                    })}
                    {/* Div invisible para asegurarse de que el chat se desplace al final */}
                    <div ref={chatEndRef}></div>
                </div>
                <div className="chat__writer">
                    <form onSubmit={sendMessage}>
                        <input type="text" placeholder='Mensaje...' value={message} onChange={(e) => setMessage(e.target.value)} />
                        <button type="submit"><FontAwesomeIcon icon={faPaperPlane} /></button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Chat;
