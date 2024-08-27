import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faPaperPlane, faImages } from '@fortawesome/free-solid-svg-icons';
const vendedor = 'https://novamarket-img.s3.us-east-2.amazonaws.com/vendedor.png';
import '../css/fruits.css';

// Supongamos que tienes un contexto de usuario para obtener el ID del usuario.
import { useUser } from '../UserContext';

const socket = io.connect('https://novamarket-backend-bb524c4ea0b6.herokuapp.com');

const Chat = () => {
    const [chatVisible, setChatVisible] = useState(false);
    const [thumbnailVisible, setThumbnailVisible] = useState(true);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const { user } = useUser(); // Obtén el usuario del contexto
    const userId = user.id; // Asumiendo que el contexto tiene un campo `id`

    useEffect(() => {
        // Obtener historial de mensajes desde el backend cuando el componente se monta
        fetch(`https://novamarket-backend-bb524c4ea0b6.herokuapp.com/chats/${userId}`)
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error('Error al cargar mensajes:', err));

        // Escuchar nuevos mensajes desde el servidor
        socket.on('receive_message', (data) => {
            // Solo agregar el mensaje si pertenece a la conversación del usuario actual
            if (data.sender_id === userId || data.receiver_id === userId) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        });

        // Limpiar el listener cuando el componente se desmonta
        return () => socket.off('receive_message');
    }, [userId]);

    const toggleChatVisibility = () => {
        setChatVisible(!chatVisible);
        setThumbnailVisible(!thumbnailVisible);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const receiverId = 1; // ID del administrador
            socket.emit('send_message', { sender_id: userId, receiver_id: receiverId, content: message });
            setMessage('');
        }
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
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.sender_id === userId ? 'message__sent' : 'message__received'}>
                            <div className="message__received__content">
                                <p>{msg.content}</p>
                            </div>
                            <p className='message__time'>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    ))}
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
