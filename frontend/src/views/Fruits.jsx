import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import fruits from '../assets/fruits.jpg';
import '../css/fruits.css';

import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';
import Chat from '../components/Chat';

const App = () => {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [hoveredArea, setHoveredArea] = useState(null);

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

    // Referencia a la imagen para calcular sus dimensiones
    const imgRef = useRef(null);

    // Función para ajustar los puntos según las dimensiones de la imagen
    useEffect(() => {
        const img = imgRef.current;
        if (img) {
            const imgWidth = img.width;
            const imgHeight = img.height;

            // Actualizar posición de los puntos basados en las dimensiones de la imagen
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

    const handleClick = area => {
        navigate(`/product/${area.id}`);
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
        <div className="shop__container">
            <img
                ref={imgRef}
                src={fruits}
                alt="Supermercado"
                className="responsive-image"
            />
            {points.map(point => (
                <div
                    key={point.id}
                    id={`point-${point.id}`}
                    className="point"
                    style={{
                        left: `${point.x * 100}%`,
                        top: `${point.y * 100}%`,
                    }}
                    onClick={() => handleClick(point)}
                    onMouseEnter={() => handleMouseEnter(point)}
                    onMouseLeave={handleMouseLeave}
                />
            ))}

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
