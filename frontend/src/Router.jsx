import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useUser } from './UserContext';

import Home from './views/Home';
import Notifications from './views/Notifications';
import Profile from './views/Profile';
import Scanner from './views/Scanner';
import Shop from './views/Shop';
import Login from './views/Login';
import Product from './views/Product';
import Cart from './views/Cart';
import Meats from './views/Meats';
import Grains from './views/Grains';
import Cleaning from './views/Cleaning';
import Fruits from './views/Fruits';
import PaymentMethod from './views/PaymentMethod';
import Historial from './views/Historial';
import Verification from './views/Verification';
import Delivery from './views/Delivery';
import Address from './views/Address';
import Admin from './views/Admin';
import VerificationSuccessfull from './views/VerificationSuccesfull'; 

const AppRouter = () => {
    const { isAuthenticated } = useUser();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verification" element={<Verification /> } />
                <Route path="/verificationsuccessfull" element={<VerificationSuccessfull /> } />
                <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/scanner" element={isAuthenticated ? <Scanner /> : <Navigate to="/login" />} />
                <Route path="/shop" element={isAuthenticated ? <Shop /> : <Navigate to="/login" />} />
                <Route path="/shop/meats" element={isAuthenticated ? <Meats /> : <Navigate to="/login" />} />
                <Route path="/shop/grains" element={isAuthenticated ? <Grains /> : <Navigate to="/login" />} />
                <Route path="/shop/cleaning" element={isAuthenticated ? <Cleaning /> : <Navigate to="/login" />} />
                <Route path="/shop/fruits" element={isAuthenticated ? <Fruits /> : <Navigate to="/login" />} />
                <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
                <Route path="/delivery" element={isAuthenticated ? <Delivery /> : <Navigate to="/login" />} />
                <Route path="/address" element={isAuthenticated ? <Address /> : <Navigate to="/login" />} />
                <Route path="/product/:data" element={isAuthenticated ? <Product /> : <Navigate to="/login" />} />
                <Route path="/paymentmethod" element={isAuthenticated ? <PaymentMethod /> : <Navigate to="/login" />} />
                <Route path="/historial/:cartId" element={isAuthenticated ? <Historial /> : <Navigate to="/login" />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
