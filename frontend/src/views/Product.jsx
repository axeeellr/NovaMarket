import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import '../css/root.css';
import '../css/product.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus, faSquarePlus, faCartShopping } from '@fortawesome/free-solid-svg-icons';

import Menu from '../components/Menu';
import TitlePage from '../components/TitlePage';
import Cart from '../components/AddToCart';
import LoadingPage from '../components/LoadingScreen'; // Importa el componente de carga

const fetchProductDataByName = async (productName) => {
    try {
        const response = await fetch(`https://novamarketbackend.onrender.com/productByName?name=${productName}`);
        if (!response.ok) {
            throw new Error('Producto no encontrado');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        toast.error('Producto no encontrado');
        return null;
    }
};

const fetchRecommendedProducts = async (category) => {
    try {
        const response = await fetch(`https://novamarketbackend.onrender.com/productsByCategory?category=${category}`);
        if (!response.ok) {
            throw new Error('Recomendaciones no disponibles');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

function Product() {
    const navigate = useNavigate();
    const { data: name } = useParams();
    const { state } = useLocation();
    const [product, setProduct] = useState(state?.productData || null);
    const { addToCart } = Cart();
    const [quantity, setQuantity] = useState(1);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga

    useEffect(() => {
        const fetchData = async () => {
            if (!product) {
                const productData = await fetchProductDataByName(name);
                setProduct(productData);
            } else {
                setLoading(false); // Datos del producto ya están disponibles
            }
        };
        fetchData();
    }, [name, product]);

    useEffect(() => {
        if (product) {
            fetchRecommendedProducts(product.category).then(data => {
                // Seleccionar productos aleatorios de la misma categoría
                const randomProducts = data.sort(() => 0.5 - Math.random()).slice(0, 5);
                setRecommendations(randomProducts);
                setLoading(false); // Datos recomendados ya están disponibles
            });
        }
    }, [product]);

    useEffect(() => {
        localStorage.setItem('productQuantity', quantity);
    }, [quantity]);

    const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleViewProduct = (recProduct) => {
        // Navegar a la página del producto recomendado
        navigate(`/product/${recProduct.name}`, { state: { productData: recProduct } });
    };

    if (loading) {
        return <LoadingPage />; // Mostrar el componente de carga mientras los datos están siendo obtenidos
    }

    if (!product) {
        return (
            <>
                <p>Producto no encontrado</p>
                <button onClick={handleGoHome}>Volver a inicio</button>
            </>
        );
    }

    const detailsMap = {
        calories: product.calories && `${product.calories}`,
        price: product.price && `$${product.price}`,
        weight: product.weight && `${product.weight}`,
    };

    const detailsToShow = Object.values(detailsMap).filter(Boolean);

    const baseUrl = 'https://novamarket-img.s3.us-east-2.amazonaws.com/';
    const imageUrl = `${baseUrl}${product.code}`;

    return (
        <>
            <div className="title__product">
                <TitlePage />
            </div>
            <div className="product__container">
                <div className="product__img">
                    <img src={imageUrl} alt={product.name} />
                </div>
                <div className="product__info">
                    <button onClick={() => addToCart(product, quantity)}>AÑADIR AL CARRITO &nbsp;<FontAwesomeIcon icon={faCartShopping} /></button>
                    <div className="product__info__details">
                        <div className="details__name">
                            <h1>{product.name}</h1>
                            <p>{product.brand}</p>
                        </div>
                        <div className="details__data">
                            {detailsToShow.map((detail, index) => (
                                <p key={index}>{detail}</p>
                            ))}
                        </div>
                        <div className="details__count">
                            <FontAwesomeIcon icon={faSquareMinus} onClick={decrementQuantity} />
                            <p>{quantity}</p>
                            <FontAwesomeIcon icon={faSquarePlus} onClick={incrementQuantity} />
                        </div>
                    </div>
                    <div className="product__info__recomendations">
                        <h1>También podría interesarte:</h1>
                        <div className="recomendations">
                            {recommendations.map((recProduct) => (
                                <div className="product__recomendation" key={recProduct.id}>
                                    <img src={`${baseUrl}${recProduct.code}`} alt={recProduct.name} />
                                    <button onClick={() => handleViewProduct(recProduct)}>VER</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Toaster toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#193E4E',
                        color: '#F2EBCF',
                    },
                }} />
            </div>
            <Menu className="menuProduct" />
        </>
    );
}

export default Product;
