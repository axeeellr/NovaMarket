import React from 'react';
import '../css/root.css';
import '../css/product.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus, faSquarePlus, faCartShopping, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

import Menu from '../components/Menu';

function Product() {
    return(
        <>
        <div className="product__title">
            <FontAwesomeIcon icon={faArrowCircleLeft} className='title__icon'/>
            <h1>Cereal Trix</h1>
        </div>
        <div className="product__container">
            <div className="product__img">
                <img src="https://www.nestle-cereals.com/cl/sites/g/files/qirczx891/files/styles/1_1_768px_width/public/2023-08/Trix.PNG.png.webp?itok=rWibg3ur" alt="" />
            </div>
            <div className="product__info">
                <button>Añadir al carrito <FontAwesomeIcon icon={faCartShopping}/></button>
                <div className="product__info__details">
                    <div className="details__name">
                        <h2>Cereal Trix</h2>
                        <p>Nestle</p>
                    </div>
                    <div className="details__data">
                        <p>110 cal.</p>
                        <p>$3.99</p>
                        <p>330 gr.</p>
                    </div>
                    <div className="details__count">
                        <FontAwesomeIcon icon={faSquareMinus}/>
                        <p>1</p>
                        <FontAwesomeIcon icon={faSquarePlus}/>
                    </div>
                </div>
            </div>
        </div>
        <Menu />
        </>
    )
}

export default Product