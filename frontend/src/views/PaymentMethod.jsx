import React, { useState, useEffect } from 'react';

import TitlePage from '../components/TitlePage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import '../css/paymentmethod.css';

const PaymentMethod = () => {

    // Estado local para las tarjetas de crédito
    const [cards, setCards] = useState([]);
    const userId = localStorage.getItem('userId');
    const [selectedCard, setSelectedCard] = useState(null);

    // Función para obtener las tarjetas de crédito del usuario
    const fetchUserCards = async () => {
        try {
            const response = await fetch(`http://localhost:1001/getCards/${userId}`);
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

    // Llamar a la función para obtener las tarjetas de crédito cuando el componente se monta
    useEffect(() => {
        fetchUserCards();
    }, []);

    const handleCardSelect = (card) => {
        if (selectedCard && selectedCard.id === card.id) {
            setSelectedCard(null); // Quita la selección si la tarjeta seleccionada es la misma
        } else {
            setSelectedCard(card); // Actualiza el estado con la tarjeta seleccionada
        }
    };

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
                                            <p>{card.number.slice(0, 4)}</p>
                                            <p>{card.number.slice(4, 8)}</p>
                                            <p>{card.number.slice(8, 12)}</p>
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
                    <p>No hay tarjetas de crédito agregadas.</p>
                )}
            </div>
            <div className="method__info">
                <FontAwesomeIcon icon={faInfoCircle} className='method__icon'/>
                <p>Elige con qué método prefieres pagar</p>
            </div>
            {cards.length > 0 && selectedCard && ( // Muestra el resumen solo si hay al menos una tarjeta y una tarjeta seleccionada
                <div className="method__summary">
                    <div className="summary__card">
                        <h3>Tarjeta de crédito</h3>
                        <p>{selectedCard.number.slice(0, 4)}&nbsp;{selectedCard.number.slice(4, 8)}&nbsp;{selectedCard.number.slice(8, 12)}&nbsp;{selectedCard.number.slice(12, 16)}&nbsp;</p>
                        <p>{selectedCard.holder}</p>
                        <p>{selectedCard.cvv}</p>
                    </div>
                    <hr />
                    <div className="summary__total">
                        <h3>Total:</h3>
                        <p>$20.00</p>
                    </div>
                </div>
            )}
            <div className="method__button">
                <button>Continuar</button>
            </div>
        </div>
    </>
    )
};

export default PaymentMethod;
