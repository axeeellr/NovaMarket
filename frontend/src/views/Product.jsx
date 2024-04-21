import React from 'react';
import { useParams, useLocation } from 'react-router-dom'

import '../css/root.css';
import '../css/product.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus, faSquarePlus, faCartShopping, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

import Menu from '../components/Menu';
import TitlePage from '../components/TitlePage';

function Product() {
    const { data: name } = useParams();
    const { state } = useLocation();
    const product = state?.productData;

    if (!product) {
        return <p>Producto no encontrado</p>;
    }

    return(
        <>
        <div className="title__product">
            <TitlePage/>
        </div>
        <div className="product__container">
            <div className="product__img">
                <img src={product.img} alt="" />
            </div>
            <div className="product__info">
                <button>Añadir al carrito <FontAwesomeIcon icon={faCartShopping}/></button>
                <div className="product__info__details">
                    <div className="details__name">
                        <h2>{product.name}</h2>
                        <p>{product.brand}</p>
                    </div>
                    <div className="details__data">
                        <p>{product.calories}</p>
                        <p>{product.price}</p>
                        <p>{product.weight}</p>
                    </div>
                    <div className="details__count">
                        <FontAwesomeIcon icon={faSquareMinus}/>
                        <p>1</p>
                        <FontAwesomeIcon icon={faSquarePlus}/>
                    </div>
                </div>
            </div>
        </div>
        <Menu className="menuProduct"/>
        </>
    )
}

export default Product