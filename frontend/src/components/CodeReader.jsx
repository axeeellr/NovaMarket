import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

const CodeReader = (props) => {
    const [data, setData] = useState('No result');
    const [key, setKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (data !== 'No result'){
            fetch(`https://novamarket.onrender.com/product?code=${encodeURIComponent(data)}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    if (localStorage.getItem('cartDetails')) {
                        const cartDetailsFromStorage = localStorage.getItem('cartDetails');
                        const parsedCartDetails = JSON.parse(cartDetailsFromStorage);
                
                        parsedCartDetails.type = 'qr';
                        localStorage.setItem('cartDetails', JSON.stringify(parsedCartDetails));
                    } else {
                        const cartDetails = {
                            name: null,
                            price: null,
                            type: 'qr',
                            deliveryOption: null,
                            address: null
                        };
                
                        localStorage.setItem('cartDetails', JSON.stringify(cartDetails));
                    }
                    navigate(`/product/${encodeURIComponent(data.name)}`, { state: { productData: data } });
                }
            })
            .catch(error => console.error('Error al consultar el servidor:', error));
        }

    }, [data, navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setKey(key + 1); // Cambia la clave para forzar la recarga del componente
        }, 500); // Dale un retraso antes de inicializar la cámara (500ms)

        return () => clearTimeout(timer); // Limpiar el temporizador en el desmontaje
    }, []);

    return (
        <>
            <QrReader
                key={key} // Cambiar clave para reinicializar el lector QR
                constraints={{ facingMode: 'environment' }}
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                    }
                }}
                style={{ width: '100%' }}
            />
        </>
    );
}

export default CodeReader;
