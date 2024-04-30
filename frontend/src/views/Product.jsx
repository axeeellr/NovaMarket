import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast';

import '../css/root.css';
import '../css/product.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus, faSquarePlus, faCartShopping, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

import Menu from '../components/Menu';
import TitlePage from '../components/TitlePage';
import Cart from '../components/AddToCart';

function Product() {
    const { data: name } = useParams();
    const { state } = useLocation();
    const product = state?.productData;
    const { addToCart } = Cart();

    if (!product) {
        return <p>Producto no encontrado</p>;
    }



    const [quantity, setQuantity] = useState(1);

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

    return(
        <>
        <div className="title__product">
            <TitlePage/>
        </div>
        <div className="product__container">
            <div className="product__img">
                <img src={product.img} alt="" />
            </div>
            <div className="product__info">
                <button onClick={() => addToCart(product, quantity)}>Añadir al carrito <FontAwesomeIcon icon={faCartShopping}/></button>
                <div className="product__info__details">
                    <div className="details__name">
                        <h2>{product.name}</h2>
                        <p>{product.brand}</p>
                    </div>
                    <div className="details__data">
                        <p>{product.calories}</p>
                        <p>{product.price}</p>
                        <p>{product.weight}</p>
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
                style:{
                    background: '#193E4E',
                    color: '#F2EBCF',
                },
            }}/>
        </div>
        <Menu className="menuProduct"/>
        </>
    )
}

export default Product