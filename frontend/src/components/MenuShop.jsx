import React from "react"
import { NavLink } from 'react-router-dom';


const MenuShop = ({ menuVisible, toggleMenuVisibility }) => {
    return (
        <div className={`shop__menu ${menuVisible ? 'visible' : 'hidden'}`}>
            <NavLink to="/shop"><p>Inicio</p></NavLink>
            <NavLink to="/shop/meats"><p>Carnes</p></NavLink>
            <p>Embutidos</p>
            <NavLink to="/shop/fruits"><p>Frutas y Verduras</p></NavLink>
            <NavLink to="/shop/grains"><p>Granos básicos</p></NavLink>
            <p>Higiene personal</p>
            <NavLink to="/shop/cleaning"><p>Limpieza</p></NavLink>
            <p>Lácteos</p>
            <p>Cereal</p>
            <p>Para bebés</p>
        </div>
    );
};

export default MenuShop