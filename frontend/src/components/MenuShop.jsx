import React from "react";
import { NavLink } from 'react-router-dom';

const MenuShop = ({ menuVisible, toggleMenuVisibility }) => {
    const handleMenuClick = () => {
        toggleMenuVisibility(); // Cierra el menú al hacer clic en cualquier parte del contenedor
    };

    const handleLinkClick = (event) => {
        event.stopPropagation(); // Evita que el evento se propague y cierre el menú al hacer clic en un enlace
        toggleMenuVisibility(); // Cierra el menú al hacer clic en un enlace específico
    };

    return (
        <div className={`shop__menu ${menuVisible ? 'visible' : 'hidden'}`} onClick={handleMenuClick}>
            <NavLink to="/shop" onClick={handleLinkClick}><p>Inicio</p></NavLink>
            <NavLink to="/shop/meats" onClick={handleLinkClick}><p>Carnes</p></NavLink>
            <NavLink to="/shop/fruits" onClick={handleLinkClick}><p>Frutas y Verduras</p></NavLink>
            <NavLink to="/shop/grains" onClick={handleLinkClick}><p>Granos básicos</p></NavLink>
            <NavLink to="/shop/hygiene" onClick={handleLinkClick}><p>Higiene personal</p></NavLink>
            <NavLink to="/shop/cleaning" onClick={handleLinkClick}><p>Limpieza</p></NavLink>
            <NavLink to="/shop/dairy" onClick={handleLinkClick}><p>Lácteos</p></NavLink>
            <NavLink to="/shop/cereal" onClick={handleLinkClick}><p>Cereal</p></NavLink>
        </div>
    );
};

export default MenuShop;
