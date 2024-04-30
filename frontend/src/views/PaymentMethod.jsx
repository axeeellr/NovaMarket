import React from 'react';

import TitlePage from '../components/TitlePage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import '../css/paymentmethod.css';

const PaymentMethod = () => {

    const selectCard = () => {
        
    }

  return(
    <>
    <div className="method__container">
        <TitlePage/>
        <div className="method__cards">
            <div className="container" onClick={selectCard}>
                <div className="card">
                    <div className="card-inner">
                        <div className="front">
                            <img src="https://i.ibb.co/PYss3yv/map.png" alt="Map" className="map-img" />
                            <div className="row">
                                <img src="https://i.ibb.co/G9pDnYJ/chip.png" alt="Chip" width="40px" />
                                <img src="https://i.ibb.co/WHZ3nRJ/visa.png" alt="Visa" width="60px" />
                            </div>
                            <div className="row card-no">
                                <p>5244</p>
                                <p>2150</p>
                                <p>8252</p>
                                <p>6420</p>
                            </div>
                            <div className="row card-holder">
                                <p>CARD HOLDER</p>
                                <p>VALID TILL</p>
                            </div>
                            <div className="row name">
                                <p>RANDALL RICARDO</p>
                                <p>10 / 25</p>
                            </div>
                        </div>
                        <div className="back">
                            <img src="https://i.ibb.co/PYss3yv/map.png" alt="Map" className="map-img" />
                            <div class="bar"></div>
                            <div className="row card-cvv">
                                <div>
                                    <img src="https://i.ibb.co/S6JG8px/pattern.png" alt="Pattern" />
                                </div>
                                <p>824</p>
                            </div>
                            <div className="row signature">
                                <p>NovaMarket</p>
                                <img src="https://i.ibb.co/WHZ3nRJ/visa.png" alt="Visa" width="80px" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" onClick={selectCard}>
                <div className="card">
                    <div className="card-inner">
                        <div className="front">
                            <img src="https://i.ibb.co/PYss3yv/map.png" alt="Map" className="map-img" />
                            <div className="row">
                                <img src="https://i.ibb.co/G9pDnYJ/chip.png" alt="Chip" width="40px" />
                                <img src="https://i.ibb.co/WHZ3nRJ/visa.png" alt="Visa" width="60px" />
                            </div>
                            <div className="row card-no">
                                <p>5244</p>
                                <p>2150</p>
                                <p>8252</p>
                                <p>6420</p>
                            </div>
                            <div className="row card-holder">
                                <p>CARD HOLDER</p>
                                <p>VALID TILL</p>
                            </div>
                            <div className="row name">
                                <p>RANDALL RICARDO</p>
                                <p>10 / 25</p>
                            </div>
                        </div>
                        <div className="back">
                            <img src="https://i.ibb.co/PYss3yv/map.png" alt="Map" className="map-img" />
                            <div class="bar"></div>
                            <div className="row card-cvv">
                                <div>
                                    <img src="https://i.ibb.co/S6JG8px/pattern.png" alt="Pattern" />
                                </div>
                                <p>824</p>
                            </div>
                            <div className="row signature">
                                <p>NovaMarket</p>
                                <img src="https://i.ibb.co/WHZ3nRJ/visa.png" alt="Visa" width="80px" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
        <div className="method__info">
            <FontAwesomeIcon icon={faInfoCircle} className='method__icon'/>
            <p>Elige con qué método prefieres pagar</p>
        </div>
        <div className="method__button">
            <button>Continuar</button>
        </div>
    </div>
    </>
  )
};

export default PaymentMethod;
