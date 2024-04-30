import { toast } from 'react-hot-toast';

function Cart() {
    const addToCart = (product, quantity) => {

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingProductIndex = cart.findIndex(item => item.name === product.name);


        if (existingProductIndex !== -1) {

            cart[existingProductIndex].quantity += quantity;

        } else {

            cart.push({
                ...product,
                quantity: quantity,
            });

        }

        localStorage.setItem('cart', JSON.stringify(cart));
        toast('¡Se añadió al carrito!');
    };

    return {
        addToCart,
    };
}

export default Cart;
