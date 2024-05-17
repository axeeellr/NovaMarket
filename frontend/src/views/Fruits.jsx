import React, {useState} from 'react';
import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';

import fruits from '../assets/fruits.jpg';
import '../css/shop.css';

const Fruits = () => {

    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    return(
        <>
            <TitlePage />
            <div className="shop__container">
                <img src={fruits}/>
                <MenuShop menuVisible={menuVisible} toggleMenuVisibility={toggleMenuVisibility} />
                <div className="shop__sections__button">
                    <button onClick={toggleMenuVisibility}>Pasillos</button>
                </div>
            </div>
        </>
    )
}

export default Fruits;