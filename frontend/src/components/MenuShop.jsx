import React from "react";
import { NavLink } from 'react-router-dom';

const MenuShop = ({ menuVisible, toggleMenuVisibility }) => {
    return (
        <div className={`shop__menu ${menuVisible ? 'visible' : 'hidden'}`}>
            <NavLink to="/shop"><p>Inicio</p></NavLink>
            <NavLink to="/shop/meats"><p>Carnes</p></NavLink>
            <NavLink to="/shop/fruits"><p>Frutas y Verduras</p></NavLink>
            <NavLink to="/shop/grains"><p>Granos básicos</p></NavLink>
            <NavLink to="/shop/hygiene"><p>Higiene personal</p></NavLink>
            <NavLink to="/shop/cleaning"><p>Limpieza</p></NavLink>
            <NavLink to="/shop/dairy"><p>Lácteos</p></NavLink>
            <NavLink to="/shop/cereal"><p>Cereal</p></NavLink>
        </div>
    );
};

export default MenuShop;
