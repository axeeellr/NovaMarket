import React, {useState} from 'react';

import CodeReader from '../components/CodeReader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import '../css/scanner.css';

const Scanner = () => {

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div className='scanner__container'>
      <div className="scanner__title">
        <FontAwesomeIcon icon={faArrowCircleLeft} className='title__icon'/>
        <h1>Escáner</h1>
      </div>
      <CodeReader/>
      <div className="scanner__info">
        <FontAwesomeIcon icon={faInfoCircle} className='info__icon' onClick={toggleVisibility}/>
        {isVisible && <p>Enfoca con tu cámara el código QR del producto para añadirlo a tu carrito de compras.</p>}
      </div>
    </div>
  );
};

export default Scanner;
