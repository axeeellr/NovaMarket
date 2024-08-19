import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCircle } from '@fortawesome/free-solid-svg-icons';

import fruits from '../assets/grainss.jpg';
import '../css/fruits.css';

import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';
import Chat from '../components/Chat';

const App = () => {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuProductsVisible, setMenuProductsVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });

    const points = [
        { name: 'nada', id: 'nada', x: 0.2, y: 0.3 },
        { name: 'Arroz', id: 'Arroz', x: 0.33, y: 0.83 },
        { name: 'Arroz Precocido', id: 'Arroz Precocido', x: 0.68, y: 0.8 },
        { name: 'Maíz', id: 'Maíz', x: 0.37, y: 0.75 },
        { name: 'Frijoles', id: 'Frijoles', x: 0.15, y: 0.75 },
        { name: 'Lentejas', id: 'Lentejas', x: 0.3, y: 0.89 },
        { name: 'Azucar', id: 'Azucar', x: 0.07, y: 0.8 },
        { name: 'Sal', id: 'Sal', x: 0.23, y: 0.7 },
        { name: 'Pan de Caja', id: 'Pan de Caja', x: 0.53, y: 0.6 },
        { name: 'Sardinas', id: 'Sardinas', x: 0.65, y: 0.5 },
        /*{ name: 'Aceite', id: 'Aceite', x: 0.93, y: 0.2 },
        { name: 'Macarrones', id: 'Macarrones', x: 0.22, y: 0.38 },*/
    ];

    const arrows = [
        { name: 'nada', id: 'nada', x: 0.2, y: 0.3 },
        { name: 'Ir a Snacks', id: 'Adelante', x: 0.61, y: 0.25 },
    ];

    const imgRef = useRef(null);
    const containerRef = useRef(null);
    const menuRef = useRef(null);

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

        // Centrando la imagen horizontalmente
        const container = containerRef.current;
        if (container) {
            container.scrollTo({
                left: (container.scrollWidth - container.clientWidth) / 2
            });
        }
    }, [points, arrows]);

    const toggleMenuProductsVisibility = (point, e) => {
        const imgRect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - imgRect.left;
        const y = e.clientY - imgRect.top;

        if (point.id === selectedPoint?.id) {
            setMenuProductsVisible(false);
            setSelectedPoint(null);
            setProducts([]);
        } else {
            setSelectedPoint(point);
            if (point) {
                axios.get(`http://localhost:1001/api/products/${point.id}`)
                    .then(response => {
                        const fetchedProducts = response.data;
                        setProducts(fetchedProducts);

                        if (fetchedProducts.length > 0) {
                            setMenuPosition({
                                left: `${x}px`,
                                top: `${y}px`
                            });
                            setMenuProductsVisible(true);
                        } else {
                            setMenuProductsVisible(false);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching products:', error);
                        setMenuProductsVisible(false);
                    });
            }
        }
    };

    const handleProductClick = (productId) => {

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
        navigate(`/product/${productId}`);
    };

    const handleArrowClick = area => {
        if (area.id === 'Atrás') {
            navigate('/shop/meats'); // Reemplazar con la ruta deseada
        } else if (area.id === 'Adelante') {
            navigate('/shop/snacks'); // Reemplazar con la ruta deseada
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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) && e.target.closest('.point') === null) {
                setMenuProductsVisible(false);
                setSelectedPoint(null);
                setProducts([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <>
            <TitlePage />
            <div className="shop__container aisle" ref={containerRef}>
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
                            onClick={(e) => toggleMenuProductsVisibility(point, e)}
                            onMouseEnter={(e) => handleMouseEnter(e, point)}
                            onMouseLeave={handleMouseLeave}
                        />
                    ))
                }

                {arrows
                    .filter(arrow => arrow.id !== 'nada') // Filtrar el primer arrow
                    .map(arrow => (
                        <div
                            key={arrow.id}
                            id={`arrow-${arrow.id}`}
                            className={arrow.id === 'Atrás' ? 'arrow' : 'arrow'}
                            style={{
                                left: `${arrow.x * 100}%`,
                                top: `${arrow.y * 100}%`,
                            }}
                            onClick={() => handleArrowClick(arrow)}
                        >
                            <FontAwesomeIcon icon={arrow.id === 'Atrás' ? faArrowLeft : faArrowRight} className='arrowIcon'/>
                            <p className='arrowText'>{arrow.name}</p>
                        </div>
                    ))
                }

                {menuProductsVisible && selectedPoint && (
                    <div className="menu-products" style={{ left: menuPosition.left, top: menuPosition.top }} ref={menuRef}>
                        
                        <ul>
                            {products.map(product => (
                                <li key={product.id} onClick={() => handleProductClick(product.name)}>
                                    <FontAwesomeIcon icon={faCircle} className='dotProduct'/> {product.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

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
