import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/admindelivery.css';

import AdminHeader from '../components/HeaderAdmin';

const AdminDelivery = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const statusOrder = ['Recibido', 'En Preparación', 'En Camino', 'Entregado'];

    useEffect(() => {
        axios.get('https://novamarketbackend.onrender.com/sales')
            .then(response => {
                const filteredOrders = response.data.filter(sale => sale.cartType === 'Domicilio');
                setOrders(filteredOrders);
            })
            .catch(error => {
                console.error('Error al obtener pedidos:', error);
            });
    }, []);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status); // Setea el estado actual cuando seleccionas un pedido
    };

    const handleBackClick = () => {
        setSelectedOrder(null);
        setNewStatus(''); // Resetea el estado cuando vuelves a la lista
    };

    const getNextStatus = (currentStatus, newStatus) => {
        const currentIndex = statusOrder.indexOf(currentStatus);
        const newIndex = statusOrder.indexOf(newStatus);
        return newIndex > currentIndex; // Devuelve true si el nuevo estado es posterior al estado actual
    };

    const handleSaveStatus = () => {
        if (selectedOrder) {
            if (getNextStatus(selectedOrder.status, newStatus)) {
                axios.put(`https://novamarketbackend.onrender.com/status/${selectedOrder.cartId}`, { status: newStatus })
                    .then(response => {
                        setOrders(prevOrders =>
                            prevOrders.map(order =>
                                order.cartId === selectedOrder.cartId
                                    ? { ...order, status: newStatus }
                                    : order
                            )
                        );
                        setSelectedOrder({ ...selectedOrder, status: newStatus }); // Actualiza el estado del pedido seleccionado
                    })
                    .catch(error => {
                        console.error('Error al actualizar el estado del pedido:', error);
                    });
            } else {
                alert('No se puede cambiar a un estado anterior.');
            }
        }
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
            <AdminHeader />
            <div className="admin-delivery">
                {selectedOrder ? (
                    <div className="order-details">
                        <button onClick={handleBackClick}>Volver</button>
                        <h2 className='order-details-title'>Detalles del Pedido #{selectedOrder.cartId} | {selectedOrder.cartName}</h2>
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
                                        <button onClick={() => openGoogleMaps(selectedOrder.address.latitude, selectedOrder.address.longitude)}>Ver en Google Maps</button>
                                        <button onClick={() => openWaze(selectedOrder.address.latitude, selectedOrder.address.longitude)}>Ver en Waze</button>
                                    </div>
                                </div>
                            </>
                        )}
                        <h2>Estado del pedido:</h2>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <option value="Recibido">Recibido</option>
                            <option value="En Preparación">En Preparación</option>
                            <option value="En Camino">En Camino</option>
                            <option value="Entregado">Entregado</option>
                        </select>
                        <button onClick={handleSaveStatus} className="save-status-btn">Guardar Estado</button>
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
                                    <tr key={order.cartId} style={{ backgroundColor: order.status === 'Entregado' ? 'lightgreen' : '' }}>
                                        <td>{order.cartId}</td>
                                        <td>{order.cartName}</td>
                                        <td>{order.userName}</td>
                                        <td>
                                            <button onClick={() => handleOrderClick(order)}>Ver Detalles</button>
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
