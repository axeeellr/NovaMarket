import React from 'react';
import '../css/root.css';
import '../css/profile.css';

import Menu from '../components/Menu';
import Header from '../components/Header';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faHeart, faSignOut, faPlusCircle, faEdit, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

function Profile() {
    return(
        <>
            <div className="profile">
                <div className="profile__title">
                    <FontAwesomeIcon icon={faArrowCircleLeft} className='title__icon'/>
                    <h1>Menú</h1>
                </div>
                <div className="profile__data">
                    <h2>Mis datos</h2>
                    <button>Editar mis datos &nbsp;<FontAwesomeIcon icon={faEdit} /></button>
                </div>
                <div className="profile__history">
                    <h2>Historial</h2>
                    <div className="history__item">
                        <p>Bebidas</p>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </div>
                    <div className="history__item">
                        <p>Compra 3</p>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </div>
                    <div className="history__item">
                        <p>Solo carnes</p>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </div>
                </div>
                <div className="profile__favorites">
                    <h2>Favoritos</h2>
                    <div className="favorites__items">
                        <div className="favorites__item">
                            <img src="https://m.media-amazon.com/images/I/51K2GrlnfjL.jpg" alt="" />
                            <div className="item__info">
                                <p>Leche Entera Pinito 300g</p>
                                <FontAwesomeIcon icon={faHeart} />
                            </div>
                        </div>
                        <div className="favorites__item">
                            <img src="https://m.media-amazon.com/images/I/819Eyei6wSL._AC_UF1000,1000_QL80_.jpg" alt="" />
                            <div className="item__info">
                                <p>Cereal Trix 420g</p>
                                <FontAwesomeIcon icon={faHeart} />
                            </div>
                        </div>
                        <div className="favorites__item">
                            <img src="https://walmartsv.vtexassets.com/arquivos/ids/423007/Pa-ales-Pampers-Swaddlers-Talla-1-96-Unidades-1-4748.jpg?v=638452930266330000" alt="" />
                            <div className="item__info">
                                <p>Pampers Swaddlers 96pcs</p>
                                <FontAwesomeIcon icon={faHeart} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile__payment">
                    <h2>Método de pago</h2>
                    <div className="container">
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
                                <div className="bar"></div>
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
                    <button className='payment__new'>Añadir nuevo &nbsp;<FontAwesomeIcon icon={faPlusCircle} /></button>
                </div>
                <div className="profile__logout">
                    <h2>Cerrar Sesión</h2>
                    <button>Cerrar Sesión &nbsp;<FontAwesomeIcon icon={faSignOut} /></button>
                </div>
            </div>
            <Menu />
        </>
    )
}

export default Profile