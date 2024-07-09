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

    const [location, setLocation] = useState(null);
    const [addressName, setAddressName] = useState('');
    const [address, setAddress] = useState([]);

    const handleSelectLocation = (location) => {
        setLocation(location);
    };

    const handleSaveAddress = async () => {
        if (location && addressName) {
            try {
                const response = await axios.post('http://localhost:1001/guardar-direccion', {
                    userId,
                    addressName,
                    lat: location.lat,
                    lng: location.lng,
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setAddress(data.address)

                    parsedCartDetails.address = address.id;
                    localStorage.setItem('cartDetails', JSON.stringify(parsedCartDetails));
                    
                    navigate('/paymentmethod');
                } else {
                    console.error('Error al guardar la dirección:', response.data.error);
                }
            } catch (error) {
                console.error('Error al guardar la dirección:', error);
            }
        }else{
            toast('¡La dirección aún no tiene nombre!');
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
                <FontAwesomeIcon icon={faEdit} className="editName" />
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
