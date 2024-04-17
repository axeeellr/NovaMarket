import React from 'react';
import { useNavigate } from 'react-router-dom';
import ImgMapper from 'react-img-mapper';

import '../css/shop.css';
import entrance from '../assets/entrance.jpeg';
import Menu from '../components/Menu';

const Shop = () => {
    const navigate = useNavigate();

    const handleAreaClick = () => {
        navigate('/product/hola');
    };

    const areas = [
        { id: '1', name: 'area1', shape: 'circle', coords: [510,712,25] }
    ];

    return(
        <>
            <div className="shop__container">
                <div className="shop__img">
                    <ImgMapper src={entrance} map={{ name: 'shop-map', areas: areas }} onClick={handleAreaClick} />
                </div>
                <div className="shop__menu">
                    <div className="menu__box">
                        
                    </div>
                </div>
            </div>
            <Menu />
        </>
    )
}

export default Shop;
