import React, { useState } from 'react';
import ImageMapper from 'react-img-mapper';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';
import PulseEffect from '../components/PulseEffect';
import Chat from '../components/Chat';

import meats from '../assets/meats.jpg';
import '../css/shop.css';

const Meats = () => {

    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [hoveredArea, setHoveredArea] = useState(null);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    const PC_COORDS = [
        { id: 'Filete de res', name: 'Filete de res', shape: "circle", coords: [200,290,10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Carne Molida de res', name: 'Carne Molida de res', shape: "circle", coords: [390,370, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Tomahawk', name: 'Tomahawk', shape: "circle", coords: [230,450, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Costilla de res', name: 'Costilla de res', shape: "circle", coords: [400,500, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Hueso especial', name: 'Hueso especial', shape: "circle", coords: [1460,275, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Churrasco redondo', name: 'Churrasco redondo', shape: "circle", coords: [1500,380, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Mollejas de res', name: 'Mollejas de res', shape: "circle", coords: [1440,470, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Lomo de res', name: 'Lomo de res', shape: "circle", coords: [1470,670, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
    ]

    const MOBILE_COORDS = [
        { id: 'Filete de res', name: 'Filete de res', shape: "circle", coords: [200,290,10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Carne Molida de res', name: 'Carne Molida de res', shape: "circle", coords: [390,370, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Tomahawk', name: 'Tomahawk', shape: "circle", coords: [230,450, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Costilla de res', name: 'Costilla de res', shape: "circle", coords: [400,500, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Hueso especial', name: 'Hueso especial', shape: "circle", coords: [1460,275, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Churrasco redondo', name: 'Churrasco redondo', shape: "circle", coords: [1500,380, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Mollejas de res', name: 'Mollejas de res', shape: "circle", coords: [1440,470, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
        { id: 'Lomo de res', name: 'Lomo de res', shape: "circle", coords: [1470,670, 10], preFillColor: "rgba(255, 255, 255, 0.7)", strokeColor: 'black', lineWidth: 5 },
    ]

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
            <div className="shop__container">
                <ImageMapper 
                    src={meats} 
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

export default Meats;
