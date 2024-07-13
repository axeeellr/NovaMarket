import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import TitlePage from '../components/TitlePage';
import { useUser } from '../UserContext';

import '../css/paymentmethod.css';

const PaymentMethod = () => {
    const navigate = useNavigate();

    // Estados
    const [cards, setCards] = useState([]);
    const { user } = useUser();
    const [selectedCard, setSelectedCard] = useState(null);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [cartProducts, setCartProducts] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState(null);

    // Recuperar del localStorage
    const cartDetailsFromStorage = localStorage.getItem('cartDetails');
    const parsedCartDetails = JSON.parse(cartDetailsFromStorage);

    // Función para obtener las tarjetas de crédito del usuario
    const fetchUserCards = async () => {
        try {
            const response = await fetch(`http://localhost:1001/getCards/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setCards(data.cards);
            } else {
                console.error('Error al obtener las tarjetas de crédito');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    const fetchDeliveryAddress = async (addressId) => {
        try {
            const response = await fetch(`http://localhost:1001/getAddress/${addressId}`);
            if (response.ok) {
                const data = await response.json();
                setDeliveryAddress(data.address);
            } else {
                console.error('Error al obtener la dirección de entrega');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    // Llamar a la función para obtener las tarjetas de crédito cuando el componente se monta
    useEffect(() => {
        fetchUserCards();
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartProducts(cart);

        if (parsedCartDetails) {
            const addressId = parsedCartDetails.address; // Suponiendo que tienes el ID de la dirección en el local storage
            if (addressId) {
                fetchDeliveryAddress(addressId);
            }
        }
    }, []);

    const handleCardSelect = (card) => {
        if (selectedCard && selectedCard.id === card.id) {
            setSelectedCard(null); // Quita la selección si la tarjeta seleccionada es la misma
        } else {
            setSelectedCard(card); // Actualiza el estado con la tarjeta seleccionada
        }
    };

    const continuePayment = async () => {
        if (!selectedCard) {
            toast.error('¡Debes seleccionar una tarjeta de crédito!');
            return;
        }

        try {
            setIsPaymentProcessing(true); 

            await toast.promise((async () => {
                // Extraer el carrito y los datos asociados desde el local storage.
                const cart = JSON.parse(localStorage.getItem('cart'));
                const cartName = parsedCartDetails.name;
                const cartPrice = parseFloat(parsedCartDetails.price); // Convertir a número.
                const userId = user.id; // Obtener el ID del usuario desde el contexto.
                const cardId = selectedCard.id;

                // 1. Guardar en la tabla `cart`.
                const cartResponse = await fetch('http://localhost:1001/addCart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        name: cartName,
                        date: new Date().toISOString(), // Fecha actual.
                        card_id: cardId,
                        total: cartPrice
                    })
                });
        
                if (!cartResponse.ok) {
                    throw new Error('Error al guardar en la tabla cart');
                }
        
                // Obtener el ID del carrito recién creado.
                const cartData = await cartResponse.json();
                const cartId = cartData.cart_id; // Asegúrate de que el servidor devuelve el cart_id.
    
                // 2. Guardar en la tabla `cart_items`.
                // Recorre cada elemento del carrito y guarda en `cart_items`.
                for (const item of cart) {
                    const itemResponse = await fetch('http://localhost:1001/addCartItem', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            cart_id: cartId, // El ID del carrito creado.
                            product_id: item.id,
                            quantity: item.quantity
                        })
                    });
        
                    if (!itemResponse.ok) {
                        throw new Error('Error al guardar en la tabla cart_items');
                    }
                }
                // Borrar `cart` y `cartDetails` del local storage
                localStorage.removeItem('cart');
                localStorage.removeItem('cartDetails');
            })(),
            {
                loading: 'Guardando...',
                success: 'Pago completado exitosamente',
                error: 'Hubo un error al procesar el pago'
            }
            );
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            // Si hay un error, muestra un mensaje de error.
            console.error('Error:', error);
        } finally {
            setIsPaymentProcessing(false); // Asegúrate de restablecer el estado, independientemente del resultado
        }
    };
    
    const goProfile = () => {
        navigate('/profile')
    }

    return(
    <>
        <div className="method__container">
            <TitlePage/>
            <div className="method__cards">
                {cards.length > 0 ? (
                    cards.map((card) => (
                        <div key={card.id} className={`container ${selectedCard && selectedCard.id === card.id ? 'selected' : ''}`} onClick={() => handleCardSelect(card)}>
                            <div className="card">
                                <div className="card-inner">
                                    <div className="front">
                                        <img src="https://i.ibb.co/PYss3yv/map.png" alt="Map" className="map-img" />
                                        <div className="row">
                                            <img src="https://i.ibb.co/G9pDnYJ/chip.png" alt="Chip" width="40px" />
                                            <img src="https://i.ibb.co/WHZ3nRJ/visa.png" alt="Visa" width="60px" />
                                        </div>
                                        <div className="row card-no">
                                            <p>****</p>
                                            <p>****</p>
                                            <p>****</p>
                                            <p>{card.number.slice(12, 16)}</p>
                                        </div>
                                        <div className="row card-holder">
                                            <p>CARD HOLDER</p>
                                            <p>VALID TILL</p>
                                        </div>
                                        <div className="row name">
                                            <p>{card.holder}</p>
                                            <p>{card.date.slice(0, 7)}</p>
                                        </div>
                                    </div>
                                    {/* Parte trasera de la tarjeta */}
                                    <div className="back">
                                        <img src="https://i.ibb.co/PYss3yv/map.png" alt="Map" className="map-img" />
                                        <div className="bar"></div>
                                        <div className="row card-cvv">
                                            <div>
                                                <img src="https://i.ibb.co/S6JG8px/pattern.png" alt="Pattern" />
                                            </div>
                                            <p>{card.cvv}</p>
                                        </div>
                                        <div className="row signature">
                                            <p>NovaMarket</p>
                                            <img src="https://i.ibb.co/WHZ3nRJ/visa.png" alt="Visa" width="80px" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <div className="method__add__cards">
                            <p>No hay tarjetas de crédito agregadas.</p>
                            <button onClick={goProfile}>Añadir</button>
                        </div>
                    </>
                )}
            </div>
            
            <div className="summary__products">
                <h2>Resumen:</h2>
                {cartProducts.length > 0 && (
                    cartProducts.map((product, index) => (
                        <div key={index} className="summary__product">
                            <div className="summary__product__image">
                                <img src={product.img} alt={product.name} />
                            </div>
                            <div className="summary__product__information">
                                <h3>{product.name}</h3>
                                <p>{product.weight}</p>
                                <p>${product.price}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {parsedCartDetails ? (
                parsedCartDetails.deliveryOption === "store" ? (
                    <div className="summary__delivery">
                        <h2>Método de entrega:</h2>
                        <p>Recoger en la tienda</p>
                    </div>
                ) : (
                    <div className="summary__delivery">
                        <h2>Método de entrega:</h2>
                        <p>{deliveryAddress ? deliveryAddress.name : 'Cargando...'}</p>
                        <div className="delivery__map">
                            {deliveryAddress && (
                                <LoadScript googleMapsApiKey="AIzaSyAcRKRW5P05BiU1nBQrjs22jqBaTEAz5L0">
                                    <GoogleMap
                                        mapContainerStyle={{ height: "100%", width: "100%" }}
                                        center={{ lat: parseFloat(deliveryAddress.latitude), lng: parseFloat(deliveryAddress.longitude) }}
                                        zoom={15}
                                    >
                                        <Marker position={{ lat: parseFloat(deliveryAddress.latitude), lng: parseFloat(deliveryAddress.longitude) }} />
                                    </GoogleMap>
                                </LoadScript>
                            )}
                        </div>
                    </div>
                )
            ) : (
                <div className="summary__delivery">
                    <h2>Método de entrega:</h2>
                    <p>Información no disponible</p>
                </div>
            )}


            <div className="method__button">
                {}
                <button onClick={continuePayment} disabled={isPaymentProcessing}>
                    <span>CONTINUAR</span>
                    <span>${parsedCartDetails ? parsedCartDetails.price : ''}</span>
                </button>
            </div>
        </div>
        <Toaster
            toastOptions={{
                duration: 3000,
                style: {
                    textAlign: 'center',
                    background: '#193E4E',
                    color: '#F2EBCF',
                },
            }}
        />
    </>
    )
};

export default PaymentMethod;
