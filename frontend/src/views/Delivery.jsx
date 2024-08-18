import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import TitlePage from '../components/TitlePage';
import Menu from '../components/Menu';

import { useUser } from '../UserContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import '../css/delivery.css';

const Delivery = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    const [addresses, setAddresses] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    // Recuperar del localStorage
    const cartDetailsFromStorage = localStorage.getItem('cartDetails');
    const parsedCartDetails = JSON.parse(cartDetailsFromStorage);

    const fetchUserAddresses = async () => {
        try {
            const response = await fetch(`http://localhost:1001/getAddresses/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setAddresses(data.addresses);
            } else {
                console.error('Error al obtener las direcciones');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    useEffect(() => {
        fetchUserAddresses();
    }, []);

    const handleSelection = (option) => {
        if (selectedOption === option) {
            setSelectedOption(null);
            setSelectedAddress(null);
        } else {
            setSelectedOption(option);
            parsedCartDetails.deliveryOption = option;
            localStorage.setItem('cartDetails', JSON.stringify(parsedCartDetails));
            if (option !== 'selectAddress') {
                setSelectedAddress(null);
            }
            if (option === 'store') {
                parsedCartDetails.address = 0;
                localStorage.setItem('cartDetails', JSON.stringify(parsedCartDetails));
            }
            console.log(option)
        }
    };

    const handleAddressSelection = (address) => {
        if (selectedAddress && selectedAddress.id === address.id) {
            setSelectedAddress(null);
        } else {
            setSelectedAddress(address);
            setSelectedOption('selectAddress');
            parsedCartDetails.address = address.id;
            localStorage.setItem('cartDetails', JSON.stringify(parsedCartDetails));
        }
    };

    const goPage = () => {
        if (!selectedOption) {
            toast.error('Por favor, selecciona una opción de entrega.');
            return;
        }
        if (selectedOption === 'selectAddress' && !selectedAddress) {
            toast.error('Por favor, selecciona una dirección.');
            return;
        }
        if (selectedOption === 'store' || (selectedOption === 'selectAddress' && selectedAddress)) {
            navigate('/paymentmethod');
        } else {
            navigate('/address');
        }
    };

    const handleDeleteClick = (address) => {
        setAddressToDelete(address);
        setIsModalOpen(true);
    };

    const confirmDeleteAddress = async () => {
        try {
            const response = await fetch(`http://localhost:1001/deleteAddress/${addressToDelete.id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Dirección eliminada exitosamente');
                setAddresses(addresses.filter((address) => address.id !== addressToDelete.id));
                setIsModalOpen(false);
                setAddressToDelete(null);
            } else {
                toast.error('Error al eliminar la dirección');
            }
        } catch (error) {
            console.error('Error al eliminar la dirección:', error);
            toast.error('Error al eliminar la dirección');
        }
    };

    return (
        <>
            <div className="delivery__container">
                <TitlePage />
                <Toaster />
                <div className={`delivery__local ${selectedOption === 'store' ? 'selected' : ''}`} onClick={() => handleSelection('store')}>
                    <div className="delivery__input">
                        <input type="radio" name="delivery" checked={selectedOption === 'store'} readOnly />
                    </div>
                    <div className="delivery__info">
                        <h2>Recoger en tienda</h2>
                        <p>Tu pedido estará listo en 1 hora, puedes pasar a recogerlo en la tienda física de NovaMarket una vez hayas completado el pago.</p>
                    </div>
                </div>
                <div className={`delivery__selectAddress ${selectedOption === 'selectAddress' ? 'selected' : ''}`} onClick={() => handleSelection('selectAddress')}>
                    <div className="delivery__input">
                        <input type="radio" name="delivery" checked={selectedOption === 'selectAddress'} readOnly />
                    </div>
                    <div className="delivery__info">
                        <h2>Escoger dirección</h2>
                        <p className='infoSelectAddress'>Aquí se muestran las direcciones que ya tienes agregadas</p>
                        {addresses.length > 0 && (
                            addresses.map((address) => (
                                <div key={address.id} className={`delivery__showAddress ${selectedAddress && selectedAddress.id === address.id ? 'selectedAddress' : ''}`} onClick={() => handleAddressSelection(address)}>
                                    <div className="showAddress__info">
                                        <p>{address.name}</p>
                                        <FontAwesomeIcon icon={faTrash} onClick={(e) => { e.stopPropagation(); handleDeleteClick(address); }} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className={`delivery__address ${selectedOption === 'address' ? 'selected' : ''}`} onClick={() => handleSelection('address')}>
                    <div className="delivery__input">
                        <input type="radio" name="delivery" checked={selectedOption === 'address'} readOnly />
                    </div>
                    <div className="delivery__info">
                        <h2>Agregar dirección</h2>
                        <p>Agrega una dirección a la cual quieres que enviemos tu pedido. Te lo entregaremos hasta la puerta de tu casa.</p>
                    </div>
                </div>
                <button onClick={goPage}>
                    <span>Continuar</span>
                    <span>${parsedCartDetails.price}</span>
                </button>
            </div>

            <Menu />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirmar eliminación</h2>
                        <p>¿Estás seguro que deseas eliminar esta dirección?</p>
                        <button className='buttonDelete' onClick={confirmDeleteAddress}>Sí, eliminar</button>
                        <button className='buttonCancel' onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}

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

export default Delivery;
