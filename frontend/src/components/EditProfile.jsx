import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { useUser } from '../UserContext';

const EditProfile = ({ isModalOpen, toggleModal }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { user, login } = useUser();
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (!isModalOpen) return null;

    return (
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
    );
};

export default EditProfile;
