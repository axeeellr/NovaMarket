import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useUser } from '../UserContext';

import '../css/root.css';
import '../css/profile.css';

import Header from '../components/Header';
import Menu from '../components/Menu';
import TitlePage from '../components/TitlePage';
import EditProfile from '../components/EditProfile';
import History from '../components/History';
import PaymentMethods from '../components/PaymentMethods';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faEdit } from '@fortawesome/free-solid-svg-icons';

import novalogostar from '../assets/novalogostar.png'

function Profile() {
    const navigate = useNavigate();
    const { logout, user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        navigate('/')
        logout();
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <div className="title__product">
                <TitlePage />
            </div>
            <div className="profile__container">
                <div className="profile">
                    <div className="profile__data">
                        <h2>Mis datos</h2>
                        <button onClick={toggleModal}>EDITAR MIS DATOS &nbsp;<FontAwesomeIcon icon={faEdit} /></button>
                    </div>
                    
                    <History user={user} />

                    <PaymentMethods user={user} />

                    <div className="profile__logout">
                        <h2>Cerrar Sesión</h2>
                        <button onClick={handleLogout}>CERRAR SESIÓN &nbsp;<FontAwesomeIcon icon={faSignOut} /></button>
                    </div>
                </div>
            </div>
            <img src={novalogostar} className='novalogo' alt=""/>
            <Menu />

            <Toaster
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#193E4E',
                        color: '#F2EBCF',
                        textAlign: 'center'
                    },
                }}
            />

            <EditProfile isModalOpen={isModalOpen} toggleModal={toggleModal} />
        </>
    );
}

export default Profile;
