import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import fruits from '../assets/meats.jpg';
import '../css/fruits.css';

import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';
import Chat from '../components/Chat';

const Meats = () => {

    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });

    const points = [
        { name: 'nada', id: 'nada', x: 0.2, y: 0.3 },
        { name: 'Filete de res', id: 'Filete de res', x: 0.1, y: 0.3 },
        { name: 'Carne Molida de res', id: 'Carne Molida de res', x: 0.25, y: 0.59 },
        { name: 'Tomahawk', id: 'Tomahawk', x: 0.12, y: 0.51 },
        { name: 'Costilla de res', id: 'Costilla de res', x: 0.23, y: 0.48 },
        { name: 'Hueso especial', id: 'Hueso especial', x: 0.93, y: 0.68 },
        { name: 'Churrasco redondo', id: 'Churrasco redondo', x: 0.92, y: 0.28 },
        { name: 'Mollejas de res', id: 'Mollejas de res', x: 0.9, y: 0.43 },
        { name: 'Lomo de res', id: 'Lomo de res', x: 0.9, y: 0.81 },
    ];

    const arrows = [
        { name: 'nada', id: 'nada', x: 0.2, y: 0.3 },
        { name: 'Ir a frutas', id: 'Atrás', x: 0.45, y: 0.45 },
        { name: 'Ir a limpieza', id: 'Adelante', x: 0.63, y: 0.45 },
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

        if (localStorage.getItem('cartDetails')) {
            // Recuperar del localStorage
            const cartDetailsFromStorage = localStorage.getItem('cartDetails');
            const parsedCartDetails = JSON.parse(cartDetailsFromStorage);
    
            parsedCartDetails.type = 'shop';
            localStorage.setItem('cartDetails', JSON.stringify(parsedCartDetails));
        }else{
            const cartDetails = {
                name: null,
                price: null,
                type: 'shop',
                deliveryOption: null,
                address: null
            };
    
            // Convertir a JSON
            const cartDetailsJSON = JSON.stringify(cartDetails);
    
            // Guardar en localStorage
            localStorage.setItem('cartDetails', cartDetailsJSON);
        }
        navigate(`/product/${area.id}`);
    };

    const handleArrowClick = area => {
        if (area.id === 'Atrás') {
            navigate('/shop/fruits'); // Reemplazar con la ruta deseada
        } else if (area.id === 'Adelante') {
            navigate('/shop/cleaning'); // Reemplazar con la ruta deseada
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

    return(
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
                            className={arrow.id === 'Atrás' ? 'arrow arrowAtras' : 'arrow arrowAdelante arrowLimpieza'}
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
    )
}

export default Meats;
