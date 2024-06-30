import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import fruits from '../assets/fruits.jpg';
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
        { name: 'Mandarinas', id: 'Mandarinas', x: 0.07, y: 0.75 },
        { name: 'Peras', id: 'Peras', x: 0.2, y: 0.65 },
        { name: 'Tomates', id: 'Tomates', x: 0.07, y: 0.51 },
        { name: 'Uvas', id: 'Uvas', x: 0.18, y: 0.48 },
        { name: 'Manzanas', id: 'Manzana Roja', x: 0.29, y: 0.57 },
        { name: 'Naranjas', id: 'Naranjas', x: 0.32, y: 0.48 },
        { name: 'Mangos', id: 'Mangos', x: 0.9, y: 0.63 },
        { name: 'Rábanos', id: 'Rábanos', x: 0.83, y: 0.56 },
        { name: 'Cilantro', id: 'Cilantro Orgánico', x: 0.78, y: 0.53 },
        { name: 'Pepinos', id: 'Pepino', x: 0.84, y: 0.43 },
        { name: 'Papas', id: 'Papa Americana', x: 0.74, y: 0.51 },
    ];

    const arrows = [
        { name: 'nada', id: 'nada', x: 0.2, y: 0.3 },
        { name: 'Ir al inicio', id: 'Atrás', x: 0.55, y: 0.4 },
        { name: 'Ir a carnes', id: 'Adelante', x: 0.58, y: 0.4 },
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
    }, [points, arrows]);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    const handleClick = area => {
        navigate(`/product/${area.id}`);
    };

    const handleArrowClick = area => {
        if (area.id === 'Atrás') {
            navigate('/shop'); // Reemplazar con la ruta deseada
        } else if (area.id === 'Adelante') {
            navigate('/shop/meats'); // Reemplazar con la ruta deseada
        }
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
                    .filter(point => point.id !== 'nada') // Filtrar el primer punto
                    .map(point => (
                        <div
                            key={point.id}
                            id={`point-${point.id}`}
                            className="point"
                            style={{
                                left: `${point.x * 100}%`,
                                top: `${point.y * 100}%`,
                            }}
                            onClick={() => handleClick(point)}
                            onMouseEnter={(e) => handleMouseEnter(e, point)}
                            onMouseLeave={handleMouseLeave}
                        />
                    ))}

                {arrows
                    .filter(arrow => arrow.id !== 'nada') // Filtrar el primer arrow
                    .map(arrow => (
                        <div
                            key={arrow.id}
                            id={`arrow-${arrow.id}`}
                            className="arrow"
                            style={{
                                left: `${arrow.x * 100}%`,
                                top: `${arrow.y * 100}%`,
                            }}
                            onClick={() => handleArrowClick(arrow)}
                        >
                            <FontAwesomeIcon icon={arrow.id === 'Atrás' ? faArrowLeft : faArrowRight} className='arrowIcon'/>
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
            </div>
        </>
    );
};

export default App;
