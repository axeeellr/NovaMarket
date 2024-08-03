import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faPaperPlane, faImages, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import '../css/adminchat.css';
import vendedor from '../assets/vendedor.png';

const AdminChat = () => {
    return (
        <>
        <div className="admin__chat">
            <div className="admin__chat__selection">
                <div className="chat__selection">
                    <h2>Pepe Aguilar</h2>
                    <p>Contesten</p>
                </div>
                <div className="chat__selection">
                    <h2>Nacho Mendez</h2>
                    <p>Hola, necesito ayuda para realizar el pa...</p>
                    <div className="unseen"></div>
                </div>
            </div>
            <div className='admin__chat__container'>
                <div className="admin__chat__header">
                    <div className="admin__chat__header__info">
                        <h2>Pepe Aguilar</h2>
                    </div>
                </div>
                <div className="admin__chat__content">
                    <div className="admin__message__sent">
                        <div className="admin__message__content">
                            <p>Hola, estoy aquí para ayudarte</p>
                        </div>
                        <p className='admin__message__time'>03:35</p>
                    </div>
                    <div className="admin__message__received">
                        <div className="admin__message__content">
                            <p>Hola, quiero comprar arroz y no me deja seleccionarlo, que hago??</p>
                        </div>
                        <p className='admin__message__time'>03:40</p>
                    </div>
                    <div className="admin__message__received">
                        <div className="admin__message__content">
                            <p>Contesten</p>
                        </div>
                        <p className='admin__message__time'>03:53</p>
                    </div>
                </div>
                <div className="admin__chat__writer">
                    <form method='post'>
                        <div className="admin__file__input">
                            <input type="file" id="fileUpload" className="admin__file-input" />
                            <label htmlFor="fileUpload" className="admin__file__input__label">
                                <FontAwesomeIcon icon={faImages} />
                            </label>
                        </div>
                        <input type="text" placeholder='Mensaje...' />
                        <button type="submit"><FontAwesomeIcon icon={faPaperPlane} /></button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};

export default AdminChat;
