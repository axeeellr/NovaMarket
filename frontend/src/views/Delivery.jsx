import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import TitlePage from '../components/TitlePage';

import { useUser } from '../UserContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import '../css/delivery.css';

const Delivery = () => {
    return(
    <>
    <div className="delivery__container">
        <TitlePage/>
        <div className="delivery__local">
            <div className="local__input">
                <input type='radio' name="" id="" />
            </div>
            <div className="local__info">
                <h2>Recoger en tienda</h2>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur nulla numquam totam, dolorum maiores perspiciatis!</p>
            </div>
        </div>
        <div className="delivery__address">
            <div className="delivery__input">
                <input type="radio" name="" id="" />
            </div>
            <div className="delivery__info">
                <h2>Escoger dirección</h2>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur nulla numquam totam, dolorum maiores perspiciatis!</p>
            </div>
        </div>
        <button>
            <span>Continuar</span>
            <span>${localStorage.getItem('cartPrice')}</span>
        </button>
    </div>
    </>
    )
};

export default Delivery;
