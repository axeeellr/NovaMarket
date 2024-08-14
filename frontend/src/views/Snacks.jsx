import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import fruits from '../assets/snacks.jpg';
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
        { name: 'Cereales', id: 'Cereal', x: 0.13, y: 0.65 },
        { name: 'Galletas', id: 'Galletas', x: 0.31, y: 0.63 },
        { name: 'Churros', id: 'Churros', x: 0.88, y: 0.69 },
        { name: 'Pan Dulce', id: 'Pan dulce', x: 0.7, y: 0.59 },
        { name: 'Chocolates', id: 'Chocolates', x: 0.8, y: 0.65 },
        { name: 'Dulces', id: 'Churrasco redondo', x: 0.32, y: 0.5 },
    ];

    const arrows = [
        { name: 'nada', id: 'nada', x: 0.2, y: 0.3 },
        { name: 'Ir a Higiene', id: 'Atrás', x: 0.40, y: 0.30 },
        { name: 'Ir a Lácteos', id: 'Adelante', x: 0.60, y: 0.30 },
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
            navigate('/shop/hygiene'); // Reemplazar con la ruta deseada
        } else if (area.id === 'Adelante') {
            navigate('/shop/dairy'); // Reemplazar con la ruta deseada
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
                            className={arrow.id === 'Atrás' ? 'arrow arrowAtras arrowHigiene' : 'arrow arrowAdelante arrowLacteos'}
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
