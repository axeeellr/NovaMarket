import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';

const PaymentMethods = ({ user }) => {
    const [cards, setCards] = useState([]);
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const toggleAddCardModal = () => {
        setIsAddCardModalOpen(!isAddCardModalOpen);
    };

    const adjustExpiryDate = (expiryDate) => {
        return expiryDate + '-01';
    };

    const handleAddCardSubmit = async (e) => {
        e.preventDefault();

        // Validar fecha de vencimiento
        const [expiryYear, expiryMonth] = expiryDate.split('-').map(Number);
        const today = new Date();
        const expiry = new Date(expiryYear, expiryMonth - 1); // Meses en JS son 0-indexados

        if (expiry < today) {
            toast.error('Fecha de vencimiento inválida.');
            return;
        }

        const cardData = {
            id_user: user.id,
            number: cardNumber,
            holder: cardHolder,
            date: adjustExpiryDate(expiryDate),
            cvv
        };

        if (!/^\d{16}$/.test(cardNumber)) {
            toast.error('La tarjeta debe tener 16 dígitos.');
            return;
        }

        if (!/^[a-zA-Z]{2,}\s[a-zA-Z]{2,}$/.test(cardHolder)) {
            toast.error('El titular de la tarjeta debe tener al menos dos nombres.');
            return;
        }

        if (!/^\d{3}$/.test(cvv)) {
            toast.error('El CVV debe tener 3 dígitos.');
            return;
        }

        try {
            const response = await fetch('https://novamarketbackend.onrender.com/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cardData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                toggleAddCardModal();
                toast('¡Tarjeta agregada!');
                fetchUserCards();
            } else {
                const errorData = await response.json();
                console.error('Error al añadir la tarjeta:', errorData.error);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    const fetchUserCards = async () => {
        try {
            const response = await fetch(`https://novamarketbackend.onrender.com/getCards/${user.id}`);
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

    useEffect(() => {
        fetchUserCards();
    }, []);

    return (
        <div className="profile__payment">
            <h2>Método de pago</h2>
            <div className="cards">
                {cards.length > 0 ? (
                    cards.map((card) => (
                        <div key={card.id} className="container">
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
            <button className="payment__new" onClick={toggleAddCardModal}>
                AÑADIR NUEVO &nbsp;
                <FontAwesomeIcon icon={faPlusCircle} />
            </button>

            {isAddCardModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Añadir Tarjeta de Crédito</h2>
                        <form onSubmit={handleAddCardSubmit}>
                            <div className="form-group">
                                <label htmlFor="cardNumber">Número de tarjeta</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cardHolder">Titular de la tarjeta</label>
                                <input
                                    type="text"
                                    id="cardHolder"
                                    value={cardHolder}
                                    onChange={(e) => setCardHolder(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="expiryDate">Fecha de vencimiento</label>
                                <input
                                    type="month"
                                    id="expiryDate"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cvv">CVV</label>
                                <input
                                    type="password"
                                    id="cvv"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Añadir Tarjeta</button>
                            <button type="button" onClick={toggleAddCardModal}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethods;
