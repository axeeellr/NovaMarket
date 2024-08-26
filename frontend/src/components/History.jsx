import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const History = ({ user }) => {
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const handleHistoryClick = (cartId) => {
        navigate(`/historial/${cartId}`);
    };

    const fetchUserCarts = async () => {
        try {
            const response = await fetch(`https://novamarket-backend-bb524c4ea0b6.herokuapp.com/getCarts/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setCarts(data.carts);
            } else {
                console.error('Error al obtener los carritos');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    useEffect(() => {
        fetchUserCarts();
    }, []);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <div className="profile__history">
            <h2>Historial</h2>
            {carts.slice(0, showAll ? carts.length : 3).map((cart, index) => {
                const date = new Date(cart.date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();

                return (
                    <div className="history__item" key={index} onClick={() => handleHistoryClick(cart.id)}>
                        <p>{cart.name} - {day}/{month}/{year}</p>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </div>
                );
            })}
            {carts.length > 3 && (
                <div className="history__more" onClick={toggleShowAll}>
                    <p>{showAll ? "Mostrar menos" : "Mostrar más"}</p>
                    <FontAwesomeIcon icon={showAll ? faCaretUp : faCaretDown} />
                </div>
            )}
            {carts.length === 0 && <p>No hay registros de compras.</p>}
        </div>
    );
};

export default History;
