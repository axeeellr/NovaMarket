import React, {useState} from 'react';
import ImageMapper from 'react-image-mapper';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';
import entrance from '../assets/entrancee.jpg';
import '../css/shop.css';

const Shop = () => {

    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [hoveredArea, setHoveredArea] = useState(null);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    const PC_COORDS = [
        { name: 'Entrar a NovaMarket', id: 'nm-x-0', shape: 'circle', coords: [820, 470, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5},
    ];

    const MOBILE_COORDS = [
        { name: 'Entrar a NovaMarket', id: 'nm-x-0', shape: 'circle', coords: [130, 600, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5},
    ];

    const MAP = {
        name: 'my-map',
        areas: isMobile ? MOBILE_COORDS : PC_COORDS,
    };

    const handleClick = area => {
        navigate(`/shop/fruits`);
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
                    src={entrance} 
                    map={MAP} 
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}  
                    className="container__img"
                />
                <MenuShop menuVisible={menuVisible} toggleMenuVisibility={toggleMenuVisibility} />
                <div className="shop__sections__button">
                    <button onClick={toggleMenuVisibility}>Pasillos</button>
                </div>
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
                            textAlign: 'center'
                        }}
                    >
                        {hoveredArea.name}
                    </div>
                )}
            </div>
        </>
    )
}

export default Shop;