import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

import TitlePage from '../components/TitlePage';
import Map from '../components/Map';

import { useUser } from '../UserContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import '../css/address.css';

const Address = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const userId = user.id;

    // Recuperar del localStorage
    const cartDetailsFromStorage = localStorage.getItem('cartDetails');
    const parsedCartDetails = JSON.parse(cartDetailsFromStorage);

    const [addressName, setAddressName] = useState('');
    const [location, setLocation] = useState(null); // Añadir estado para la ubicación seleccionada

    const handleSelectLocation = (location) => {
        setLocation(location);
    };

    const handleSaveAddress = async () => {
        if (!addressName || !location) {
            toast.error('Por favor, complete todos los campos y seleccione una ubicación.');
            return;
        }

        try {
            const response = await axios.post('https://novamarketbackend.onrender.com/guardar-direccion', {
                userId,
                addressName,
                lat: location.lat,
                lng: location.lng,
            });

            if (response.status === 200) {
                const addressId = response.data.address.insertId; // Asegúrate de que el campo sea el correcto
                parsedCartDetails.address = addressId;

                localStorage.setItem('cartDetails', JSON.stringify(parsedCartDetails));
                navigate('/paymentmethod');

            } else {
                toast.error('Error al guardar la dirección');
            }
        } catch (error) {
            console.error("Error al guardar la dirección:", error);
            toast.error('Error al guardar la dirección');
        }
    };

    return (
        <>
        <div className="address__container">
            <TitlePage />
            <div className="address__name">
                <input
                    type="text"
                    required
                    placeholder="Nombre de la dirección..."
                    value={addressName}
                    onChange={(e) => setAddressName(e.target.value)}
                />
                <FontAwesomeIcon icon={faEdit} className="editNameAddress" />
            </div>
            <div className="address">
                <Map onSelectLocation={handleSelectLocation} />
            </div>
            <button className='address__button' onClick={handleSaveAddress}>Guardar y Continuar</button>
        </div>


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

export default Address;
