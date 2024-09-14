import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const fruits = 'https://novamarket-img.s3.us-east-2.amazonaws.com/entrance.png';
import '../css/fruits.css';

import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';
import Chat from '../components/Chat';
import Help from '../components/Help';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

const App = () => {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });
    const [helpVisible, setHelpVisible] = useState(false);

    const arrows = [
        { name: 'nada', id: 'nada', x: 0.2, y: 0.3 },
        { name: 'Ir a NovaMarket', id: 'Entrar', x: 0.5, y: 0.65 },
    ];

    const imgRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const img = imgRef.current;
        if (img) {
            const imgWidth = img.width;
            const imgHeight = img.height;

            arrows.forEach(arrow => {
                const left = arrow.x * imgWidth;
                const top = arrow.y * imgHeight;
                const arrowElement = document.getElementById(`arrow-${arrow.id}`);
                if (arrowElement) {
                    arrowElement.style.left = `${left}px`;
                    arrowElement.style.top = `${top}px`;
                }
            });
        }

        const container = containerRef.current;
        if (container) {
            container.scrollTo({
                left: (container.scrollWidth - container.clientWidth) / 2
            });
        }

        // Verificar si el usuario ha visitado la página antes
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
            setTimeout(() => {
                setHelpVisible(true);
                localStorage.setItem('hasVisited', 'true');
            }, "1000");
        }
    }, [arrows]);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    const handleArrowClick = area => {
        if (area.id === 'Entrar') {
            navigate('/shop/fruits'); 
        }
    };

    const handleMouseEnter = (e, point) => {
        const imgRect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - imgRect.left;
        const y = e.clientY - imgRect.top;

        setTooltip({
            visible: true,
            name: point.name,
            x: x + 10,  
            y: y + 10   
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ visible: false, name: '', x: 0, y: 0 });
    };

    return (
        <>
            <TitlePage />
            <div className="shop__container" ref={containerRef}>
                <img
                    ref={imgRef}
                    src={fruits}
                    alt="Supermercado"
                    className="responsive-image"
                />
                {arrows
                    .filter(arrow => arrow.id !== 'nada') 
                    .map(arrow => (
                        <div
                            key={arrow.id}
                            id={`arrow-${arrow.id}`}
                            className="arrow arrowup"
                            style={{
                                left: `${arrow.x * 100}%`,
                                top: `${arrow.y * 100}%`,
                            }}
                            onClick={() => handleArrowClick(arrow)}
                        >
                            <FontAwesomeIcon icon={faArrowUp} className='arrowIcon'/>
                            <p className='arrowText'>{arrow.name}</p>
                        </div>
                    ))}

                <div
                    className={`tooltip ${tooltip.visible ? 'visible' : ''}`}
                    style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
                >
                    {tooltip.name}
                </div>

                <MenuShop menuVisible={menuVisible} toggleMenuVisibility={toggleMenuVisibility} />
                
                <div className="shop__sections__button">
                    <button onClick={toggleMenuVisibility}>Pasillos</button>
                </div>

                <Chat />
                <Help helpVisible={helpVisible} setHelpVisible={setHelpVisible} />
            </div>
        </>
    );
};

export default App;
