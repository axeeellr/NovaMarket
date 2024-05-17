import React, {useState} from 'react';
import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';

import grains from '../assets/grains.jpg';
import '../css/shop.css';

const Grains = () => {

    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    return(
        <>
            <TitlePage />
            <div className="shop__container">
                <img src={grains}/>
                <MenuShop menuVisible={menuVisible} toggleMenuVisibility={toggleMenuVisibility} />
                <div className="shop__sections__button">
                    <button onClick={toggleMenuVisibility}>Pasillos</button>
                </div>
            </div>
        </>
    )
}

export default Grains;