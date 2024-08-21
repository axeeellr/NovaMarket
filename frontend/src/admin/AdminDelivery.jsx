import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../css/admindelivery.css';

import AdminHeader from '../components/HeaderAdmin';

const AdminDelivery = () => {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        // Fetch orders from backend
        axios.get('http://localhost:1001/sales')
            .then(response => {
                // Filter orders where type is 'Domicilio'
                const filteredOrders = response.data.filter(sale => sale.cartType === 'Domicilio');
                setOrders(filteredOrders);
            })
            .catch(error => {
                console.error('Error al obtener pedidos:', error);
            });
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirige al usuario a la página de inicio de sesión
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleBackClick = () => {
        setSelectedOrder(null);
    };

    const handleCompleteClick = (orderId) => {
        axios.put(`http://localhost:1001/status/${orderId}`, { status: 1 })
            .then(response => {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.cartId === orderId
                            ? { ...order, status: 1 }
                            : order
                    )
                );
            })
            .catch(error => {
                console.error('Error al actualizar el estado del pedido:', error);
            });
    };

    const openGoogleMaps = (latitude, longitude) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        window.open(url, '_blank');
    };

    const openWaze = (latitude, longitude) => {
        const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
        window.open(url, '_blank');
    };

    return (
        <>
            <AdminHeader/>
            <div className="admin-delivery">
                {selectedOrder ? (
                    <div className="order-details">
                        <button onClick={handleBackClick}>Volver</button>
                        <h2 className='order-details-title'>Detalles del Pedido #{selectedOrder.cartId}</h2>
                        <h2 className='order-details-user'><strong>Usuario:</strong> {selectedOrder.userName} (ID: {selectedOrder.userId})</h2>
                        {selectedOrder.cartType === 'Domicilio' && selectedOrder.address && (
                            <>
                                <h2 className='order-details-user'><strong>Dirección:</strong> {selectedOrder.address.addressName}</h2>
                                <div className="map-container">
                                    <div className="map">
                                        <iframe
                                            width="100%"
                                            height="300"
                                            src={`https://maps.google.com/maps?q=${selectedOrder.address.latitude},${selectedOrder.address.longitude}&z=15&output=embed`}
                                            frameBorder="0"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    <div className="buttons-map">
                                        <button onClick={() => openGoogleMaps(selectedOrder.address.latitude, selectedOrder.address.longitude)}>Google Maps</button>
                                        <button onClick={() => openWaze(selectedOrder.address.latitude, selectedOrder.address.longitude)}>Waze</button>
                                    </div>
                                </div>
                            </>
                        )}
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.productName}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="orders-list">
                        <h1>Pedidos</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID del carrito</th>
                                    <th>Nombre del carrito</th>
                                    <th>Nombre del Usuario</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.cartId} style={{ backgroundColor: order.status === 1 ? 'lightgreen' : '' }}>
                                        <td>{order.cartId}</td>
                                        <td>{order.cartName}</td>
                                        <td>{order.userName}</td>
                                        <td>
                                            <button onClick={() => handleOrderClick(order)}>Ver Detalles</button>
                                            {order.status !== 1 && (
                                                <button onClick={() => handleCompleteClick(order.cartId)} className='completed'>
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminDelivery;
