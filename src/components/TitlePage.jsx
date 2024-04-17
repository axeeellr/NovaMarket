import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/title.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

function TitlePage() {
    const location = useLocation();
    const pageTitles = {
        '/profile': 'Perfil',
        '/settings': 'Ajustes',
        '/cart':  'Carrito'
    };

    const currentPage = pageTitles[location.pathname];

    const goBack = () => {
        window.history.back();
    };

    return (
        <>
            <div className="title">
                <Link to="#" onClick={goBack}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} className='title__icon'/>
                </Link>
                <h1>{currentPage || 'Menú'}</h1>
            </div>
        </>
    );
}

export default TitlePage;
