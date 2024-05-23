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
import { faAngleRight, faSignOut, faPlusCircle, faEdit, faCaretDown, faCaretUp, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Profile() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { logout, user, login } = useUser();

    const handleLogout = () => {
        navigate('/')
        logout();
    };

    const handleHistoryClick = (cartId) => {
        navigate(`/historial/${cartId}`);
        console.log(cartId)
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const updatedData = { name, email };
        if (oldPassword && newPassword) {
            updatedData.oldPassword = oldPassword;
            updatedData.newPassword = newPassword;
        }

        try {
            const response = await axios.put(`http://localhost:1001/data/${user.id}`, updatedData);
            if (response.status === 200) {
                toast('¡Datos actualizados!');
                axios.get(`http://localhost:1001/data/${user.id}`)
                    .then(response => {
                        const userData = response.data.user;
                        login(userData);
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
            if (error.response && error.response.status === 401) {
                toast.error('Contraseña antigua incorrecta.');
            } else {
                toast.error('Error al actualizar datos del usuario.');
            }
        }
    };

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
            const response = await fetch('http://localhost:1001/cards', {
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

    const [carts, setCarts] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const fetchUserCarts = async () => {
        try {
            const response = await fetch(`http://localhost:1001/getCarts/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setCarts(data.carts);
            } else {
                console.error('Error al obtener los carritos');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        fetchUserCards();
    }, []);

    useEffect(() => {
        fetchUserCarts();
    }, []);

    return (
        <>
            <div className="title__product">
                <TitlePage />
            </div>
            <div className="profile">
                <div className="profile__data">
                    <h2>Mis datos</h2>
                    <button onClick={toggleModal}>EDITAR MIS DATOS &nbsp;<FontAwesomeIcon icon={faEdit} /></button>
                </div>
                <div className="profile__history">
                    <h2>Historial</h2>
                    {carts.slice(0, showAll ? carts.length : 3).map((cart, index) => {
                        // Convertir la fecha de cada carrito a un objeto Date
                        const date = new Date(cart.date);
                        // Obtener el año, mes y día
                        const year = date.getFullYear();
                        const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1
                        const day = date.getDate();
                        
                        return (
                            <div className="history__item" key={index} onClick={() => handleHistoryClick(cart.id)}>
                                <p>{cart.name} - {day}/{month}/{year}</p>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                        );
                    })}
                    {carts.length > 3 && (
                        <div className="history__more" onClick={toggleShowAll}>
                            <p>{showAll ? "Mostrar menos" : "Mostrar más"}</p>
                            <FontAwesomeIcon icon={showAll ? faCaretUp : faCaretDown} />
                        </div>
                    )}
                    {carts.length === 0 && <p>No hay registros de compras.</p>}
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
                </div>

                <div className="profile__logout">
                    <h2>Cerrar Sesión</h2>
                    <button onClick={handleLogout}>CERRAR SESIÓN &nbsp;<FontAwesomeIcon icon={faSignOut} /></button>
                </div>
            </div>
            <Menu />

            <Toaster
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#193E4E',
                        color: '#F2EBCF',
                        textAlign: 'center'
                    },
                }}
            />

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
                            <div className="form-group password-input">
                                <label htmlFor="oldPassword">Contraseña Antigua</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    onClick={togglePasswordVisibility}
                                    className="password-icon"
                                />
                            </div>
                            <div className="form-group password-input">
                                <label htmlFor="newPassword">Nueva Contraseña</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required={oldPassword.length > 0}
                                />
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    onClick={togglePasswordVisibility}
                                    className="password-icon"
                                />
                            </div>
                            <button type="submit">Guardar Cambios</button>
                            <button type="button" onClick={toggleModal}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}

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
