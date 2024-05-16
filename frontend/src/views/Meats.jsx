import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import TitlePage from '../components/TitlePage';

import granos from '../assets/granos.jpg';
import '../css/shop.css';

const Shop = () => {

    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    return(
        <>
            <TitlePage />
            <div className="shop__container">
                <img src={granos}/>
                <div className={`shop__menu ${menuVisible ? 'visible' : 'hidden'}`}>
                    <NavLink to="/shop/meats"><p>Carnes</p></NavLink>
                    <p>Embutidos</p>
                    <p>Frutas y verduras</p>
                    <p>Granos básicos</p>
                    <p>Higiene personal</p>
                    <p>Limpieza</p>
                    <p>Lácteos</p>
                    <p>Cereal</p>
                    <p>Para bebés</p>
                </div>
                <div className="shop__sections__button">
                    <button onClick={toggleMenuVisibility}>Pasillos</button>
                </div>
            </div>
        </>
    )
}

export default Shop;