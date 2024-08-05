import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

const CodeReader = (props) => {
    const [data, setData] = useState('No result');
    const navigate = useNavigate();

    useEffect(() => {
        if (data !== 'No result'){
            fetch(`http://localhost:1001/product?code=${encodeURIComponent(data)}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    if (localStorage.getItem('cartDetails')) {
                        // Recuperar del localStorage
                        const cartDetailsFromStorage = localStorage.getItem('cartDetails');
                        const parsedCartDetails = JSON.parse(cartDetailsFromStorage);
                
                        parsedCartDetails.type = 'qr';
                        localStorage.setItem('cartDetails', JSON.stringify(parsedCartDetails));
                    }else{
                        const cartDetails = {
                            name: null,
                            price: null,
                            type: 'qr',
                            deliveryOption: null,
                            address: null
                        };
                
                        // Convertir a JSON
                        const cartDetailsJSON = JSON.stringify(cartDetails);
                
                        // Guardar en localStorage
                        localStorage.setItem('cartDetails', cartDetailsJSON);
                    }
                    navigate(`/product/${encodeURIComponent(data.name)}`, { state: { productData: data } });
                }
            })
        .catch(error => console.error('Error al consultar el servidor:', error));
        }

    }, [data, navigate])

    return (
        <>
            <QrReader
            onResult={(result, error) => {
                if (!!result) {
                    setData(result?.text);
                }
    
                if (!!error) {
                //console.info(error);
                }
            }}
            style={{ width: '100%' }}
            />
        </>
    );
}

export default CodeReader;