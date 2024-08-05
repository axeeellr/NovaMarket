import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faCheck } from '@fortawesome/free-solid-svg-icons';
import '../css/adminsales.css';
import axios from 'axios';

import AdminHeader from '../components/HeaderAdmin';

const AdminSales = () => {
    const [sales, setSales] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);

    useEffect(() => {
        // Fetch sales from backend
        axios.get('http://localhost:1001/sales')
            .then(response => {
                const filteredSales = response.data.filter(sale => sale.cartType !== 'Domicilio');
                const sortedSales = filteredSales.sort((a, b) => {
                    if (a.cartType === 'Recoger en tienda' && b.cartType !== 'Recoger en tienda') return -1;
                    if (a.cartType !== 'Recoger en tienda' && b.cartType === 'Recoger en tienda') return 1;
                    return 0;
                });
                setSales(sortedSales);
            })
            .catch(error => {
                console.error('Error al obtener ventas:', error);
            });
    }, []);

    const handleSaleClick = sale => {
        setSelectedSale(sale);
    };

    const handleBackClick = () => {
        setSelectedSale(null);
    };

    const handleCompleteClick = sale => {
        axios.put(`http://localhost:1001/status/${sale.cartId}`, { status: 1 })
            .then(response => {
                setSales(prevSales =>
                    prevSales.map(s => s.id === sale.id ? { ...s, status: 1 } : s)
                );
            })
            .catch(error => {
                console.error('Error al actualizar el estado de la venta:', error);
            });
    };

    const formatTime = dateString => {
        const date = new Date(dateString);
        return date.toTimeString().substr(0, 5); // 'HH:mm'
    };

    const addHour = dateString => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 1);
        return date;
    };

    return (
        <>
            <AdminHeader/>
            <div className="admin-sales">
                {selectedSale ? (
                    <div className="sale-details">
                        <button onClick={handleBackClick}>Volver</button>
                        <h2 className="sale-details-title">Detalles de {selectedSale.cartName}</h2>
                        <h2 className='sale-details-user'><strong>Usuario:</strong> {selectedSale.userName} ID: {selectedSale.userId}</h2>
                        <h2 className='sale-details-user'>
                            <strong>Hora de pedido:</strong> {formatTime(selectedSale.date)}
                            {selectedSale.cartType !== 'QR' && (
                                <>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Hora de entrega:</strong> {formatTime(addHour(selectedSale.date))}</>
                            )}
                        </h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedSale.items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.productName}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h2 className='sale-details-user'>Total: ${selectedSale.cartTotal}</h2>
                    </div>
                ) : (
                    <div className="sales-list">
                        <h1>Compras</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID del carrito</th>
                                    <th>Nombre del carrito</th>
                                    <th>Nombre del usuario</th>
                                    <th>Tipo de compra</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map(sale => (
                                    <tr key={sale.id} style={{ backgroundColor: sale.status === 1 ? 'lightgreen' : '' }}>
                                        <td>{sale.cartId}</td>
                                        <td>{sale.cartName}</td>
                                        <td>{sale.userName}</td>
                                        <td>{sale.cartType}</td>
                                        <td>
                                            <button onClick={() => handleSaleClick(sale)}>Ver Detalles</button>
                                            {sale.cartType === 'Recoger en tienda' && sale.status !== 1 && (
                                                <button onClick={() => handleCompleteClick(sale)} className='completed'>
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

export default AdminSales;
