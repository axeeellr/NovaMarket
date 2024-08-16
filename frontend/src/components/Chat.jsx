import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faPaperPlane, faImages, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import vendedor from '../assets/vendedor.png';
import '../css/fruits.css';

const Chat = () => {
    const [chatVisible, setChatVisible] = useState(false);
    const [thumbnailVisible, setThumbnailVisible] = useState(true); 

    const toggleChatVisibility = () => {
        setChatVisible(!chatVisible);
        setThumbnailVisible(!thumbnailVisible);
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
                    <div className="message__received">
                        <div className="message__received__content">
                            <p>Hola, estoy aquí para ayudarte</p>
                        </div>
                        <p className='message__time'>03:35</p>
                    </div>
                    <div className="message__sent">
                        <div className="message__received__content">
                            <p>Hola, quiero comprar arroz y no me deja seleccionarlo, que hago??</p>
                        </div>
                        <p className='message__time'>03:40</p>
                    </div>
                    <div className="message__sent">
                        <div className="message__received__content">
                            <p>Contesten</p>
                        </div>
                        <p className='message__time'>03:53</p>
                    </div>
                </div>
                <div className="chat__writer">
                    <form method='post'>
                        <div className="file__input">
                            <input type="file" id="fileUpload" className="file-input" />
                            <label htmlFor="fileUpload" className="file__input__label">
                                <FontAwesomeIcon icon={faImages} />
                            </label>
                        </div>
                        <input type="text" placeholder='Mensaje...' />
                        <button type="submit"><FontAwesomeIcon icon={faPaperPlane} /></button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Chat;
