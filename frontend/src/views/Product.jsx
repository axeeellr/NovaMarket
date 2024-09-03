import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import '../css/root.css';
import '../css/product.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus, faSquarePlus, faCartShopping } from '@fortawesome/free-solid-svg-icons';

import Menu from '../components/Menu';
import TitlePage from '../components/TitlePage';
import Cart from '../components/AddToCart';

const fetchProductDataByName = async (productName) => {
    try {
        const response = await fetch(`https://novamarket.onrender.com/productByName?name=${productName}`);
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

function Product() {
    const { data: name } = useParams();
    const { state } = useLocation();
    const [product, setProduct] = useState(state?.productData || null);
    const { addToCart } = Cart();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!product) {
            fetchProductDataByName(name).then(setProduct);
        }
    }, [name, product]);

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

    if (!product) {
        return <p>Producto no encontrado</p>;
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
