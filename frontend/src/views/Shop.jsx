import React, { useState, useRef, useEffect } from 'react';
import ImageMapper from 'react-image-mapper';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';
import PulseEffect from '../components/PulseEffect'; // Import the PulseEffect component

import entrance from '../assets/entrancee.jpg';
import vendedor from '../assets/vendedor.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faPaperPlane, faImages, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import '../css/shop.css';

const Shop = () => {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [hoveredArea, setHoveredArea] = useState(null);
    const [helpVisible, setHelpVisible] = useState(true);  // Estado para la visibilidad de shop__help
    const [thumbnailVisible, setThumbnailVisible] = useState(false); 
    const [chatVisible, setChatVisible] = useState(false); // Estado para la visibilidad del chat
    const containerRef = useRef(null); // Create a ref for the container

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const centerX = (container.scrollWidth - container.clientWidth) / 2;
            container.scrollLeft = centerX;
        }
    }, []);


    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    const PC_COORDS = [
        { name: 'Entrar a NovaMarket', id: 'nm-x-0', shape: 'circle', coords: [820, 470, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5},
    ];

    const MOBILE_COORDS = [
        { name: 'Entrar a NovaMarket', id: 'nm-x-0', shape: 'circle', coords: [820, 550, 10], preFillColor: 'rgba(255, 255, 255, 0.7)', strokeColor: 'black', lineWidth: 5},
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

    const toggleChatVisibility = () => {
        setChatVisible(!chatVisible);
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



                <div className={`shop__help ${!helpVisible ? 'hidden' : ''}`}>
                    <FontAwesomeIcon icon={faCircleXmark} className='help__close' onClick={() => {setHelpVisible(false); setTimeout(() => setThumbnailVisible(true), 300);}}/>
                    <div className="help__info">
                        <h1>Bienvenido a la Tienda de NovaMarket</h1>
                        <p>Hola, soy Don Mario! Haz click en los productos que quieras para seleccionarlos. Puedes hablar conmigo en el chat de abajo, será un gusto atenderte.</p>
                    </div>
                    <img src={vendedor}/>
                </div>



                <div className={`chat__thumbnail ${thumbnailVisible && !chatVisible ? 'visible' : ''}`} onClick={toggleChatVisibility}>
                    <img src={vendedor}/>
                    <p>1</p>
                </div>



                <div className={`chat__container ${chatVisible ? 'visible' : ''}`}>
                    <div className="chat__header">
                        <div className="chat__header__info">
                            <img src={vendedor}/>
                            <h2>Don Mario</h2>
                        </div>
                        <FontAwesomeIcon icon={faSortDown} className='chat__close' onClick={toggleChatVisibility}/>
                    </div>
                    <div className="chat__content">
                        <div className="message__received">
                            <div className="message__received__content">
                                <p>Hola, estoy aquí para ayudarte</p>
                            </div>
                            <p className='message__time'>03:35</p>
                        </div>
                        <div className="message__sent">
                            <div className="message__received__content">
                                <p>Hola, quiero comprar arroz y no me deja seleccionarlo, que hago??</p>
                            </div>
                            <p className='message__time'>03:40</p>
                        </div>
                        <div className="message__sent">
                            <div className="message__received__content">
                                <p>Contesten</p>
                            </div>
                            <p className='message__time'>03:53</p>
                        </div>
                    </div>
                    <div className="chat__writer">
                        <form method='post'>
                            <div className="file__input">
                                <input type="file" id="fileUpload" className="file-input" />
                                <label htmlFor="fileUpload" className="file__input__label">
                                    <FontAwesomeIcon icon={faImages} />
                                </label>
                            </div>
                            <input type="text" placeholder='Mensaje...' />
                            <button type="submit"><FontAwesomeIcon icon={faPaperPlane}/></button>
                        </form>
                    </div>
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
