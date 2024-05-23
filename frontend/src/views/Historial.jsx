import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import '../css/cart.css';
import TitlePage from '../components/TitlePage';
import Menu from '../components/Menu';

const Historial = () => {
    const { cartId } = useParams();
    const [cartDetails, setCartDetails] = useState(null);

    useEffect(() => {
        fetchCartDetails(cartId);
    }, [cartId]);


    const fetchCartDetails = async (cartId) => {
        try {
            const response = await fetch(`http://localhost:1001/getCartDetails/${cartId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart details');
            }
            const data = await response.json();
            setCartDetails(data);
        } catch (error) {
            console.error('Error fetching cart details:', error);
        }
    };
    

    return (
        <>
            <div className="cart__container">
                <TitlePage title="Historial de Compras" />
                <div className="cart__products">
                    {cartDetails && cartDetails.products.map((product, index) => (
                        <div className="cart__product" key={index}>
                            <div className="product__image">
                                <img src={product.img} alt={product.name} />
                            </div>
                            <div className="product__information">
                                <h3>{product.name}</h3>
                                <p>{product.weight}</p>
                                <p>${product.price}</p>
                            </div>
                            <div className="product__quantity">
                                <div className="quantity">
                                    <FontAwesomeIcon icon={faSquarePlus} />
                                    <p>{product.quantity}</p>
                                </div>
                            </div>
                            <div className="product__date">
                                <p>{product.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Menu />

            <Toaster
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#193E4E',
                        color: '#F2EBCF',
                    },
                }}
            />
        </>
    );
};

export default Historial;
