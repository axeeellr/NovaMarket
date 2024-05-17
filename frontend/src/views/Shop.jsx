import React, {useState} from 'react';
import TitlePage from '../components/TitlePage';
import MenuShop from '../components/MenuShop';
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
                <MenuShop menuVisible={menuVisible} toggleMenuVisibility={toggleMenuVisibility} />
                <div className="shop__sections__button">
                    <button onClick={toggleMenuVisibility}>Pasillos</button>
                </div>
            </div>
        </>
    )
}

export default Shop;