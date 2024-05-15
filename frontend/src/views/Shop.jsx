import React, {useState} from 'react';
import TitlePage from '../components/TitlePage';

import entrance from '../assets/entrance.png';
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
                <img src={entrance}/>
                <div className={`shop__menu ${menuVisible ? 'visible' : 'hidden'}`}>
                    <p>Carnes</p>
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