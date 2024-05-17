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

const AppRouter = () => {
    const { isAuthenticated } = useUser();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/scanner" element={isAuthenticated ? <Scanner /> : <Navigate to="/login" />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/meats" element={<Meats />} />
                <Route path="/shop/grains" element={<Grains />} />
                <Route path="/shop/cleaning" element={<Cleaning />} />
                <Route path="/shop/fruits" element={<Fruits />} />
                <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
                <Route path="/product/:data" element={isAuthenticated ? <Product /> : <Navigate to="/login" />} />
                <Route path="/paymentmethod" element={isAuthenticated ? <PaymentMethod /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
