import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/root.css';
import '../css/profile.css';
import Menu from '../components/Menu';
import TitlePage from '../components/TitlePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faHeart, faSignOut, faPlusCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();

    // Estados locales para el modal y los datos del usuario
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userIdStorage, setUserIdStorage] = useState(null);

    // Almacena el ID del usuario en el estado si está presente en localStorage
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserIdStorage(storedUserId);
        }
    }, []);

    // Realiza la petición de datos si se tiene un ID de usuario almacenado
    useEffect(() => {
        if (userIdStorage) {
            axios.get(`http://localhost:1001/data/${userIdStorage}`)
                .then(response => {
                    const userData = response.data.user;
                    // Establece los estados locales con los datos del usuario
                    setName(userData.name);
                    setEmail(userData.email);
                    // Si hay otros datos que necesitas, actualiza los estados locales correspondientes
                })
                .catch(error => {
                    console.error('Error al obtener datos del usuario:', error);
                });
        }
    }, [userIdStorage]);

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
            // Realiza la solicitud HTTP para actualizar los datos del usuario en la base de datos
            const response = await axios.put(`http://localhost:1001/data/${userIdStorage}`, updatedData);
            
            // Verifica si la respuesta es exitosa
            if (response.status === 200) {
                console.log('Datos del usuario actualizados con éxito');
                // Opcional: realiza acciones adicionales como actualizar el estado o mostrar un mensaje de éxito al usuario
                toggleModal();
            } else {
                console.error('Error inesperado al actualizar datos del usuario:', response.status);
            }
        } catch (error) {
            console.error('Error al guardar datos del usuario:', error);
            // Puedes considerar mostrar un mensaje de error al usuario aquí
        }
    };
    

    const logOut = () => {
        navigate("/");
        localStorage.removeItem("userId");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("cart");
    };

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
                    <div className="container">
                        <div className="card">
                            <div className="card-inner">
                                <div className="front">
                                    <img src="https://i.ibb.co/PYss3yv/map.png" alt="Map" className="map-img" />
                                    <div className="row">
                                        <img src="https://i.ibb.co/G9pDnYJ/chip.png" alt="Chip" width="40px" />
                                        <img src="https://i.ibb.co/WHZ3nRJ/visa.png" alt="Visa" width="60px" />
                                    </div>
                                    <div className="row card-no">
                                        <p>5244</p>
                                        <p>2150</p>
                                        <p>8252</p>
                                        <p>6420</p>
                                    </div>
                                    <div className="row card-holder">
                                        <p>CARD HOLDER</p>
                                        <p>VALID TILL</p>
                                    </div>
                                    <div className="row name">
                                        <p>RANDALL RICARDO</p>
                                        <p>10 / 25</p>
                                    </div>
                                </div>
                                <div className="back">
                                    <img src="https://i.ibb.co/PYss3yv/map.png" alt="Map" className="map-img" />
                                    <div class="bar"></div>
                                    <div className="row card-cvv">
                                        <div>
                                            <img src="https://i.ibb.co/S6JG8px/pattern.png" alt="Pattern" />
                                        </div>
                                        <p>824</p>
                                    </div>
                                    <div className="row signature">
                                        <p>NovaMarket</p>
                                        <img src="https://i.ibb.co/WHZ3nRJ/visa.png" alt="Visa" width="80px" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className='payment__new'>Añadir nuevo &nbsp;<FontAwesomeIcon icon={faPlusCircle} /></button>
                </div>
                <div className="profile__logout" onClick={logOut}>
                    <h2>Cerrar Sesión</h2>
                    <button>Cerrar Sesión &nbsp;<FontAwesomeIcon icon={faSignOut} /></button>
                </div>
            </div>
            <Menu />

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
                            {/* Contraseña antigua */}
                            <div className="form-group">
                                <label htmlFor="oldPassword">Contraseña Antigua</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>
                            {/* Nueva contraseña */}
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
        </>
    );
}

export default Profile;
