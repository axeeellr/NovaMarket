import React, { useState } from 'react';
import ImageMapper from 'react-image-mapper';
import { isMobile } from 'react-device-detect'; // Importa la función isMobile
import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';

import fruits from '../assets/fruits.jpg';
import '../css/shop.css';

const Fruits = () => {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    // Define las coordenadas para PC y móvil
    const PC_COORDS = [
        // Coordenadas para PC
        { name: 'Mandarinas', shape: 'circle', coords: [130, 540, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5},
        { name: 'Peras', shape: 'circle', coords: [300, 450, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Tomates', shape: 'circle', coords: [100, 360, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Uvas', shape: 'circle', coords: [290, 345, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Manzanas', shape: 'circle', coords: [450, 400, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Naranjas', shape: 'circle', coords: [510, 340, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Mangos', shape: 'circle', coords: [1400, 450, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Rábanos', shape: 'circle', coords: [1270, 400, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Cilantro', shape: 'circle', coords: [1190, 380, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Pepinos', shape: 'circle', coords: [1280, 310, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Papas', shape: 'circle', coords: [1120, 365, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
    ];

    const MOBILE_COORDS = [
        // Coordenadas para dispositivos móviles
        { name: 'Mandarinas', shape: 'circle', coords: [130, 600, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5},
        { name: 'Peras', shape: 'circle', coords: [300, 530, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Tomates', shape: 'circle', coords: [100, 430, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Uvas', shape: 'circle', coords: [290, 415, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Manzanas', shape: 'circle', coords: [450, 480, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Naranjas', shape: 'circle', coords: [510, 400, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Mangos', shape: 'circle', coords: [1450, 510, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Rábanos', shape: 'circle', coords: [1350, 455, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Cilantro', shape: 'circle', coords: [1250, 440, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Pepinos', shape: 'circle', coords: [1340, 380, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Papas', shape: 'circle', coords: [1240, 380, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
    ];

    // Utiliza las coordenadas adecuadas según el tipo de dispositivo
    const MAP = {
        name: 'my-map',
        areas: isMobile ? MOBILE_COORDS : PC_COORDS,
    };

    const handleClick = area => {
        console.log('Area clicked:', area);
    };

    return(
        <>
            <TitlePage />
            <div className="shop__container">
                <ImageMapper src={fruits} map={MAP} onClick={handleClick} className="container__img"/>
                <MenuShop menuVisible={menuVisible} toggleMenuVisibility={toggleMenuVisibility} />
                <div className="shop__sections__button">
                    <button onClick={toggleMenuVisibility}>Pasillos</button>
                </div>
            </div>
        </>
    )
}

export default Fruits;
