import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus, faSquarePlus, faEdit } from '@fortawesome/free-solid-svg-icons';

import '../css/cart.css';

import TitlePage from '../components/TitlePage';
import Menu from '../components/Menu';

const Cart = () => {
    return(
        <>
            <div className="cart__container">
                <TitlePage/>
                <div className="cart__products">
                    <div className="cart__name">
                        <input type="text" name="" id="" placeholder='Nombre del carrito...'/>
                        <FontAwesomeIcon icon={faEdit} className='editName'/>
                    </div>
                    <div className="cart__product">
                        <div className="product__image">
                            <img src="https://www.nestle-cereals.com/cl/sites/g/files/qirczx891/files/styles/1_1_768px_width/public/2023-08/Trix.PNG.png.webp?itok=rWibg3ur" alt="" />
                        </div>
                        <div className="product__information">
                            <h3>Cereal Trix</h3>
                            <p>330g</p>
                            <p>$4.50</p>
                        </div>
                        <div className="product__quantity">
                            <div className="quantity">
                                <FontAwesomeIcon icon={faSquareMinus}/>
                                <p>1</p>
                                <FontAwesomeIcon icon={faSquarePlus}/>
                            </div>
                        </div>
                    </div>
                    <div className="cart__product">
                        <div className="product__image">
                            <img src="https://www.nestle-cereals.com/cl/sites/g/files/qirczx891/files/styles/1_1_768px_width/public/2023-08/Trix.PNG.png.webp?itok=rWibg3ur" alt="" />
                        </div>
                        <div className="product__information">
                            <h3>Cereal Trix</h3>
                            <p>330g</p>
                            <p>$4.50</p>
                        </div>
                        <div className="product__quantity">
                            <div className="quantity">
                                <FontAwesomeIcon icon={faSquareMinus}/>
                                <p>1</p>
                                <FontAwesomeIcon icon={faSquarePlus}/>
                            </div>
                        </div>
                    </div>
                    <div className="cart__product">
                        <div className="product__image">
                            <img src="https://www.nestle-cereals.com/cl/sites/g/files/qirczx891/files/styles/1_1_768px_width/public/2023-08/Trix.PNG.png.webp?itok=rWibg3ur" alt="" />
                        </div>
                        <div className="product__information">
                            <h3>Cereal Trix</h3>
                            <p>330g</p>
                            <p>$4.50</p>
                        </div>
                        <div className="product__quantity">
                            <div className="quantity">
                                <FontAwesomeIcon icon={faSquareMinus}/>
                                <p>1</p>
                                <FontAwesomeIcon icon={faSquarePlus}/>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="cart__button">
                    <button><span>Continuar</span><span>$9.00</span></button>
                </div>
            </div>
            <Menu />
        </>
    )
}

export default Cart;
