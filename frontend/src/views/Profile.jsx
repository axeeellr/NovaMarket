import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import { useUser } from '../UserContext';

import '../css/root.css';
import '../css/profile.css';

import Menu from '../components/Menu';
import TitlePage from '../components/TitlePage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faSignOut, faPlusCircle, faEdit } from '@fortawesome/free-solid-svg-icons';

function Profile() {

    const navigate = useNavigate();
    const { logout, user, login } = useUser();

    const handleLogout = () => {
        navigate('/')
        logout();
    };

    // Estados locales para el modal y los datos del usuario
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    

    // Realiza la petición de datos si se tiene un ID de usuario almacenado
    useEffect(() => {
        if (user.id) {
            axios.get(`http://localhost:1001/data/${user.id}`)
                .then(response => {
                    const userData = response.data.user;
                    setName(userData.name);
                    setEmail(userData.email);
                })
                .catch(error => {
                    console.error('Error al obtener datos del usuario:', error);
                });
        }
    }, [user.id]);

    // Función para manejar la visibilidad del modal
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Función para manejar el envío del formulario
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Define los datos que se enviarán a la base de datos
        const updatedData = {
            name,
            email
        };
        
        // Solo agregar campos de contraseña si ambos están llenos
        if (oldPassword && newPassword) {
            updatedData.oldPassword = oldPassword;
            updatedData.newPassword = newPassword;
        }
    
        try {
            const response = await axios.put(`http://localhost:1001/data/${user.id}`, updatedData);
            
            // Verifica si la respuesta es exitosa
            if (response.status === 200) {
                toast('¡Datos actualizados!');
                axios.get(`http://localhost:1001/data/${user.id}`)
                .then(response => {
                    const userData = response.data.user;
                    login(userData)
                })
                .catch(error => {
                    console.error('Error al obtener datos del usuario:', error);
                });
                toggleModal();
            } else {
                console.error('Error inesperado al actualizar datos del usuario:', response.status);
            }
        } catch (error) {
            console.error('Error al guardar datos del usuario:', error);
        }
    };

    // Estado local para las tarjetas de crédito
    const [cards, setCards] = useState([]);

    // Estado para el modal de añadir tarjeta de crédito
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    
    // Estados para los datos del formulario de añadir tarjeta de crédito
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    // Función para mostrar/ocultar el modal de añadir tarjeta de crédito
    const toggleAddCardModal = () => {
        setIsAddCardModalOpen(!isAddCardModalOpen);
    };

    //Función para añadir un 1 a la fecha
    const adjustExpiryDate = (expiryDate) => {
        // Completa el valor con '-01' para tener un formato de fecha completo
        return expiryDate + '-01';
    };

    // Función para manejar el envío de los datos de la tarjeta de crédito
    const handleAddCardSubmit = async (e) => {
        e.preventDefault();
        
        // Datos de la tarjeta de crédito
        const cardData = {
            id_user: user.id,
            number: cardNumber,
            holder: cardHolder,
            date: adjustExpiryDate(expiryDate),
            cvv: cvv
        };
    
        try {
            const response = await fetch('http://localhost:1001/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cardData)
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                toggleAddCardModal();
                toast('¡Tarjeta agregada!');
                // Recarga la lista de tarjetas de crédito
                fetchUserCards();
            } else {
                const errorData = await response.json();
                console.error('Error al añadir la tarjeta:', errorData.error);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

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

    // Llamar a la función para obtener las tarjetas de crédito cuando el componente se monta
    useEffect(() => {
        fetchUserCards();
    }, []);

    return (
        <>
            <div className="profile">
                <TitlePage />
                <div className="profile__data">
                    <h2>Mis datos</h2>
                    <button onClick={toggleModal}>Editar mis datos &nbsp;<FontAwesomeIcon icon={faEdit} /></button>
                </div>
                <div className="profile__history">
                    <h2>Historial</h2>
                    <div className="history__item">
                        <p>Bebidas</p>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </div>
                    <div className="history__item">
                        <p>Compra 3</p>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </div>
                    <div className="history__item">
                        <p>Solo carnes</p>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </div>
                </div>
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
                    <button className="payment__new" onClick={toggleAddCardModal}>
                        Añadir nuevo &nbsp;
                        <FontAwesomeIcon icon={faPlusCircle} />
                    </button>
                </div>

                <div className="profile__logout">
                    <h2>Cerrar Sesión</h2>
                    <button onClick={handleLogout}>Cerrar Sesión &nbsp;<FontAwesomeIcon icon={faSignOut} /></button>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Editar Mis Datos</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="oldPassword">Contraseña Antigua</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="newPassword">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    // Solo requerir nueva contraseña si se ha ingresado la contraseña antigua
                                    required={oldPassword.length > 0}
                                />
                            </div>
                            <button type="submit">Guardar Cambios</button>
                            <button type="button" onClick={toggleModal}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}


            {/* Modal para añadir tarjeta de crédito */}
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
        </>
    );
}

export default Profile;
