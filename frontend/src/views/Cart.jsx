import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus, faSquarePlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import '../css/cart.css';
import TitlePage from '../components/TitlePage';
import Menu from '../components/Menu';

const Cart = () => {
    const navigate = useNavigate();

    const [cartProducts, setCartProducts] = useState([]);
    const [cartName, setCartName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDeleteIndex, setProductToDeleteIndex] = useState(null);
    
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartProducts(cart);
    }, []);
    
    // Recuperar del localStorage
    const cartDetailsFromStorage = localStorage.getItem('cartDetails');
    const parsedCartDetails = JSON.parse(cartDetailsFromStorage);

    // Función para modificar la cantidad de un producto
    const modifyQuantity = (index, change) => {
        const updatedCart = [...cartProducts];
        if (change === 'increment') {
            updatedCart[index].quantity += 1;
        } else if (change === 'decrement') {
            if (updatedCart[index].quantity === 1) {
                setProductToDeleteIndex(index);
                setIsModalOpen(true);
                return;
            }
            updatedCart[index].quantity -= 1;
        }
        setCartProducts(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Función para eliminar un producto del carrito
    const deleteProduct = () => {
        const updatedCart = cartProducts.filter((_, index) => index !== productToDeleteIndex);
        setCartProducts(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setIsModalOpen(false);
    };

    // Calcula el total del carrito
    const calculateTotal = () => {
        return cartProducts.reduce((total, product) => {
            return total + product.quantity * parseFloat(product.price);
        }, 0).toFixed(2);
    };

    // Función para manejar el cambio de nombre del carrito
    const handleNameChange = (event) => {
        const newCartName = event.target.value;
        parsedCartDetails.name = newCartName;
        localStorage.setItem('cartDetails', JSON.stringify(parsedCartDetails));
        setCartName(newCartName);
    };

    // Función para manejar el evento de continuar
    const handleContinue = () => {
        if (parsedCartDetails.name == '' || parsedCartDetails.name == null) {
            toast.error('¡La compra aún no tiene nombre!');
        } else if(localStorage.getItem('cart') == '[]' || !localStorage.getItem('cart')){
            toast.error('¡No hay productos en el carrito!');
        }else {
            parsedCartDetails.price = calculateTotal();
            localStorage.setItem('cartDetails', JSON.stringify(parsedCartDetails));

            if (parsedCartDetails.type == 'shop') {
                navigate('/delivery');
            }else{
                navigate('/paymentmethod');
            }
        }
    };

    const baseUrl = 'https://novamarket-img.s3.us-east-2.amazonaws.com/';

    return (
        <>
            <div className="cart__container">
                <TitlePage />
                <div className="cart__products">
                    <div className="cart__name">
                        <input type="text" value={parsedCartDetails ? parsedCartDetails.name : ''} onChange={handleNameChange} required placeholder="Nombre del carrito..." />
                        <FontAwesomeIcon icon={faEdit} className="editName" />
                    </div>

                    {cartProducts.length > 0 ? (
                        cartProducts.map((product, index) => (
                            <div key={index} className="cart__product">
                                <div className="product__image">
                                    <img src={`${baseUrl}${product.code}`} alt={product.name} />
                                </div>
                                <div className="product__information">
                                    <h3>{product.name}</h3>
                                    <p>{product.weight}</p>
                                    <p>${product.price}</p>
                                </div>
                                <div className="product__quantity">
                                    <div className="quantity">
                                        <FontAwesomeIcon icon={faSquareMinus} onClick={() => modifyQuantity(index, 'decrement')} />
                                        <p>{product.quantity}</p>
                                        <FontAwesomeIcon icon={faSquarePlus} onClick={() => modifyQuantity(index, 'increment')} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='emptyCart'>No hay productos en el carrito...</p>
                    )}
                <div className="cart__button">
                    <button onClick={handleContinue}>
                        <span>CONTINUAR</span>
                        <span>${calculateTotal()}</span>
                    </button>
                </div>
                </div>
                
            </div>

            <Menu />

            {/* Modal personalizado */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirmar eliminación</h2>
                        <p>¿Estás seguro de que deseas eliminar este producto del carrito?</p>
                        <button className='buttonDelete' onClick={deleteProduct}>Sí, eliminar</button>
                        <button className='buttonCancel' onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            <Toaster
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#193E4E',
                        color: '#F2EBCF',
                    },
                }}
            />
        </>
    );
};

export default Cart;

//local storage
//name, price, type(shop, scann), deliveryoption