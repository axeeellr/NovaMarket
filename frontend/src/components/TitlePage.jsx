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
    }else if(location.pathname.startsWith('/historial/')){
        currentPage = 'Historial';
    }else{
        const pageTitles = {
            '/profile': 'Perfil',
            '/cart':  'Carrito',
            '/shop':  'Tienda',
            '/scanner':  'Escáner',
            '/verification': 'Verificación',
            '/paymentmethod':  'Método de Pago',
            '/delivery': 'Método de Entrega',
            '/address': 'Seleccionar Dirección',
            '/shop/meats':  'Carnes',
            '/shop/grains':  'Granos básicos',
            '/shop/cleaning':  'Limpieza',
            '/shop/fruits':  'Frutas y verduras',
            '/shop/dairy':  'Lácteos',
            '/shop/hygiene':  'Higiene',
            '/shop/cereal':  'Cereal'
        };
        currentPage = pageTitles[location.pathname];
    }

    const goBack = () => {
        window.history.back();
    };

    const titleClassName = location.pathname.startsWith('/shop') ? 'title title__shop' : 'title';

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
