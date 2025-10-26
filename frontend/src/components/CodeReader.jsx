import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Quagga from 'quagga'; // Importa QuaggaJS

const CodeReader = (props) => {
    const [data, setData] = useState('No result');
    const navigate = useNavigate();

    useEffect(() => {
        // Configuración de Quagga para leer códigos de barras
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#interactive'), // El contenedor donde se muestra el feed de la cámara
                constraints: {
                    facingMode: "environment" // Usar la cámara trasera
                },
            },
            decoder: {
                readers: ["ean_reader", "upc_reader"], // EAN-13 y UPC para productos de supermercado
            },
        }, function (err) {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Quagga initialization finished.");
            Quagga.start(); // Inicia el escaneo
        });

        // Escuchar cuando se detecta un código de barras
        Quagga.onDetected((result) => {
            const barcode = result.codeResult.code;
            setData(barcode); // Guarda el código de barras en el estado
            console.log("Barcode detected:", barcode);
        });

        return () => {
            Quagga.stop(); // Detener Quagga cuando el componente se desmonta
        };
    }, []);

    // Enviar el código de barras al servidor para obtener información del producto
    useEffect(() => {
        if (data !== 'No result') {
            fetch(`https://novamarketbackend.onrender.com/product?code=${encodeURIComponent(data)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error(data.error);
                    } else {
                        // Guardar detalles del carrito en localStorage
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

                        // Redirigir a la página del producto con los datos obtenidos
                        navigate(`/product/${encodeURIComponent(data.name)}`, { state: { productData: data } });
                    }
                })
                .catch(error => console.error('Error al consultar el servidor:', error));
        }
    }, [data, navigate]);

    return (
        <>
            <div id="interactive" style={{ width: '100%' }}></div> {/* Aquí se muestra el feed de la cámara */}
        </>
    );
};

export default CodeReader;
