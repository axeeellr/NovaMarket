import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import '../css/cart.css';
import '../css/historial.css';
import TitlePage from '../components/TitlePage';
import Menu from '../components/Menu';

const Historial = () => {
    const { cartId } = useParams();
    const [cartDetails, setCartDetails] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);

    useEffect(() => {
        fetchCartDetails(cartId);
    }, [cartId]);

    const fetchCartDetails = async (cartId) => {
        try {
            const response = await fetch(`https://novamarket-backend-bb524c4ea0b6.herokuapp.com/getCartDetails/${cartId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart details');
            }
            const data = await response.json();
            setCartDetails(data.products);
            setOrderStatus(data.status);
        } catch (error) {
            console.error('Error fetching cart details:', error);
        }
    };

    const getStepClass = (step) => {
        const steps = ['Recibido', 'En Preparación', 'En Camino', 'Entregado'];
        const currentStepIndex = steps.indexOf(orderStatus);

        if (currentStepIndex > step) return 'stepper-item completedd';
        if (currentStepIndex === step) return 'stepper-item activee';
        return 'stepper-item';
    };

    const getStepName = (step) => {
        const steps = ['Recibido', 'En Preparación', 'En Camino', 'Entregado'];
        return steps[step];
    };

    return (
        <>
            <div className="cart__container">
                <TitlePage title="Historial de Compras" />
                <div className="historial__tracker">
                    <h2>Seguimiento del pedido</h2>
                    <div className="stepper-wrapper">
                        {[0, 1, 2, 3].map(step => (
                            <div key={step} className={getStepClass(step)}>
                                <div className="step-counter">{step + 1}</div>
                                {getStepClass(step) === 'stepper-item activee' && (
                                    <div className="step-name">{getStepName(step)}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="cart__products">
                    {cartDetails && cartDetails.map((product, index) => (
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
                                    <FontAwesomeIcon icon={faCartArrowDown} />
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
