import React, { useState } from 'react';
import ImageMapper from 'react-image-mapper';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';
import PulseEffect from '../components/PulseEffect';
import Chat from '../components/Chat';

import fruits from '../assets/fruits.jpg';
import '../css/shop.css';

const Fruits = () => {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [hoveredArea, setHoveredArea] = useState(null);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    const PC_COORDS = [
        { name: 'Mandarinas', id: 'nm-x-0', shape: 'circle', coords: [130, 540, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5},
        { name: 'Peras', id: 'nm-x-0', shape: 'circle', coords: [300, 450, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Tomates', id: 'Bandeja de Fresas', shape: 'circle', coords: [100, 360, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Uvas', id: 'Bandeja%20de%20Fresas', shape: 'circle', coords: [290, 345, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Manzanas', id: 'nm-x-0', shape: 'circle', coords: [450, 400, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Naranjas', id: 'nm-x-0', shape: 'circle', coords: [510, 340, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Mangos', id: 'nm-x-0', shape: 'circle', coords: [1440, 450, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Rábanos', id: 'nm-x-0', shape: 'circle', coords: [1320, 400, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Cilantro', id: 'nm-x-0', shape: 'circle', coords: [1230, 380, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Pepinos', id: 'nm-x-0', shape: 'circle', coords: [1330, 310, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Papas', id: 'nm-x-0', shape: 'circle', coords: [1170, 365, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
    ];

    const MOBILE_COORDS = [
        { name: 'Mandarinas', id: 'nm-x-0', shape: 'circle', coords: [130, 600, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5},
        { name: 'Peras', id: 'nm-x-0', shape: 'circle', coords: [300, 530, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Tomates', id: 'Bandeja de Fresas', shape: 'circle', coords: [100, 430, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Uvas', id: 'nm-x-0', shape: 'circle', coords: [290, 415, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Manzanas', id: 'nm-x-0', shape: 'circle', coords: [450, 480, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Naranjas', id: 'nm-x-0', shape: 'circle', coords: [510, 400, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Mangos', id: 'nm-x-0', shape: 'circle', coords: [1450, 510, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Rábanos', id: 'nm-x-0', shape: 'circle', coords: [1350, 455, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Cilantro', id: 'nm-x-0', shape: 'circle', coords: [1250, 440, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Pepinos', id: 'nm-x-0', shape: 'circle', coords: [1340, 380, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
        { name: 'Papas', id: 'nm-x-0', shape: 'circle', coords: [1240, 380, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
    ];

    // Utiliza las coordenadas adecuadas según el tipo de dispositivo
    const MAP = {
        name: 'my-map',
        areas: isMobile ? MOBILE_COORDS : PC_COORDS,
    };

    const handleClick = area => {
        navigate(`/product/${area.id}`);
    };

    const handleMouseEnter = area => {
        setHoveredArea(area);
    };

    const handleMouseLeave = () => {
        setHoveredArea(null);
    };

    return(
        <>
            <TitlePage />
            <div className={`shop__container ${menuVisible ? 'blur' : ''}`}>
                <ImageMapper 
                    src={fruits} 
                    map={MAP} 
                    onClick={handleClick} 
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}  
                    className="container__img"
                />
                {MAP.areas.map((area, index) => (
                    <PulseEffect 
                        key={index}
                        x={area.coords[0] - area.coords[2]} // Adjust for the radius
                        y={area.coords[1] - area.coords[2]} // Adjust for the radius
                        size={area.coords[2] * 2} // Diameter of the circle
                    />
                ))}

                <MenuShop menuVisible={menuVisible} toggleMenuVisibility={toggleMenuVisibility} />
                
                <div className="shop__sections__button">
                    <button onClick={toggleMenuVisibility}>Pasillos</button>
                </div>

                <Chat />

                {hoveredArea && (
                    <div 
                        className="hover__label" 
                        style={{
                            position: 'absolute',
                            left: `${hoveredArea.coords[0]}px`,
                            top: `${hoveredArea.coords[1] + 20}px`, // Ajusta la posición para estar justo debajo
                            transform: 'translate(-50%, 0)', // Centrar horizontalmente
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '5px',
                            borderRadius: '5px',
                            pointerEvents: 'none',
                            zIndex: 1000,
                        }}
                    >
                        {hoveredArea.name}
                    </div>
                )}
            </div>
        </>
    )
}

export default Fruits
