import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../css/cart.css';
import TitlePage from '../components/TitlePage';
import Menu from '../components/Menu';

const Historial = () => {
    const { cartId } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/history/${cartId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    toast.error(data.error);
                } else {
                    setHistory(data.history);
                }
            })
            .catch(error => {
                toast.error('Error al cargar el historial de compras');
                console.error('Error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [cartId]);

    return (
        <>
            <div className="cart__container">
                <TitlePage title="Historial de Compras" />
                <div className="cart__products">
                    {loading ? (
                        <p>Cargando...</p>
                    ) : history.length > 0 ? (
                        history.map((item, index) => (
                            <div className="cart__product" key={index}>
                                <div className="product__image">
                                    <img src={item.img} alt={item.name} />
                                </div>
                                <div className="product__information">
                                    <h3>{item.name}</h3>
                                    <p>{item.weight}</p>
                                    <p>${item.price}</p>
                                </div>
                                <div className="product__quantity">
                                    <div className="quantity">
                                        <p>Cantidad: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="product__date">
                                    <p>{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay registros de compras.</p>
                    )}
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
