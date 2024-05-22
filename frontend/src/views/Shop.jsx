import React, { useState, useRef, useEffect } from 'react';
import ImageMapper from 'react-image-mapper';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';
import PulseEffect from '../components/PulseEffect';
import Chat from '../components/Chat';
import Help from '../components/Help'; 

import entrance from '../assets/entrancee.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faPaperPlane, faImages, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import '../css/shop.css';

const Shop = () => {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [hoveredArea, setHoveredArea] = useState(null);
    const [helpVisible, setHelpVisible] = useState(false);  // Estado para la visibilidad de shop__help
    const containerRef = useRef(null); // Create a ref for the container

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const centerX = (container.scrollWidth - container.clientWidth) / 2;
            container.scrollLeft = centerX;
        }

        const isFirstVisit = localStorage.getItem('firstVisit');
        if (!isFirstVisit) {
            setHelpVisible(true);
            localStorage.setItem('firstVisit', 'true');
        }
    }, []);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    const PC_COORDS = [
        { name: 'Entrar a NovaMarket', id: 'nm-x-0', shape: 'circle', coords: [820, 470, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
    ];

    const MOBILE_COORDS = [
        { name: 'Entrar a NovaMarket', id: 'nm-x-0', shape: 'circle', coords: [820, 550, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5 },
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

    return (
        <>
            <TitlePage />
            <div className={`shop__container ${menuVisible ? 'blur' : ''}`} ref={containerRef}>
                <ImageMapper
                    src={entrance}
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

                <Help helpVisible={helpVisible} setHelpVisible={setHelpVisible} />
                
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
                            textAlign: 'center'
                        }}
                    >
                        {hoveredArea.name}
                    </div>
                )}
            </div>
        </>
    );
}

export default Shop;
