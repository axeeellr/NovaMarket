import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/title.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

function TitlePage() {
    const location = useLocation();
    let currentPage = ''

    if(location.pathname.startsWith('/product/')){
        currentPage = decodeURIComponent(location.pathname.split('/product/')[1]);
    }else{
        const pageTitles = {
            '/profile': 'Perfil',
            '/cart':  'Carrito',
            '/shop':  'Tienda',
            '/scanner':  'Escáner',
            '/paymentmethod':  'Método de Pago'
        };
        currentPage = pageTitles[location.pathname];
    }

    const goBack = () => {
        window.history.back();
    };

    const titleClassName = location.pathname === '/shop' ? 'title title__shop' : 'title';

    return (
        <>
            <div className={titleClassName}>
                <Link to="#" onClick={goBack}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} className='title__icon'/>
                </Link>
                <h1>{currentPage}</h1>
            </div>
        </>
    );
}

export default TitlePage;
