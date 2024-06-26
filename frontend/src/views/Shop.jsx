import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import fruits from '../assets/entrance.png';
import '../css/fruits.css';

import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';
import Chat from '../components/Chat';

const App = () => {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });

    const points = [
        { name: 'nada', id: 'nada', x: 0.2, y: 0.3 },
        { name: 'Entrar a NovaMarket', id: 'Mandarinas', x: 0.5, y: 0.65 },
    ];

    const imgRef = useRef(null);

    useEffect(() => {
        const img = imgRef.current;
        if (img) {
            const imgWidth = img.width;
            const imgHeight = img.height;

            points.forEach(point => {
                const left = point.x * imgWidth;
                const top = point.y * imgHeight;
                const pointElement = document.getElementById(`point-${point.id}`);
                if (pointElement) {
                    pointElement.style.left = `${left}px`;
                    pointElement.style.top = `${top}px`;
                }
            });
        }
    }, [points]);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    const handleClick = () => {
        navigate('/shop/fruits');
    };

    const handleMouseEnter = (e, point) => {
        const imgRect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - imgRect.left;
        const y = e.clientY - imgRect.top;

        setTooltip({
            visible: true,
            name: point.name,
            x: x + 10,  // Offset for better positioning
            y: y + 10   // Offset for better positioning
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ visible: false, name: '', x: 0, y: 0 });
    };

    return (
        <>
            <TitlePage />
            <div className="shop__container">
                <img
                    ref={imgRef}
                    src={fruits}
                    alt="Supermercado"
                    className="responsive-image"
                />
                {points
                .filter(point => point.id !== 'nada')
                .map(point => (
                    <div
                        key={point.id}
                        id={`point-${point.id}`}
                        className="point"
                        style={{
                            left: `${point.x * 100}%`,
                            top: `${point.y * 100}%`,
                        }}
                        onClick={() => handleClick()}
                        onMouseEnter={(e) => handleMouseEnter(e, point)}
                        onMouseLeave={handleMouseLeave}
                    />
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
            </div>
        </>
    );
};

export default App;
