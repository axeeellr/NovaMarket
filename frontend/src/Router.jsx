import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { useUser } from './UserContext';
import ProtectedRoute from './ProtectedRoute';
import PageTransition from './components/PageTransition'; // Importa el componente de transición

import Home from './views/Home';
import Notifications from './views/Notifications';
import Profile from './views/Profile';
import Scanner from './views/Scanner';
import Shop from './views/Shop';
import Login from './views/Login';
import Product from './views/Product';
import Cart from './views/Cart';
import Meats from './views/Meats';
import Hygiene from './views/Hygiene';
import Snacks from './views/Snacks';
import Dairy from './views/Dairy';
import Grains from './views/Grains';
import Cleaning from './views/Cleaning';
import Fruits from './views/Fruits';
import PaymentMethod from './views/PaymentMethod';
import Historial from './views/Historial';
import Verification from './views/Verification';
import Delivery from './views/Delivery';
import Address from './views/Address';
import VerificationSuccessfull from './views/VerificationSuccesfull'; 
import Admin from './admin/Admin';
import AdminUsers from './admin/AdminUsers';
import AdminProducts from './admin/AdminProducts';
import AdminSales from './admin/AdminSales';
import AdminChat from './admin/AdminChat';
import AdminNotifications from './admin/AdminNotifications';
import AdminDelivery from './admin/AdminDelivery';

const AppRouter = () => {
    const { isAuthenticated } = useUser();

    return (
        <Router>
            <PageTransition>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verification" element={<Verification />} />
                    <Route path="/verificationsuccessfull" element={<VerificationSuccessfull />} />
                    <Route path="/notifications" element={<ProtectedRoute element={Notifications} />} />
                    <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
                    <Route path="/scanner" element={<ProtectedRoute element={Scanner} />} />
                    <Route path="/shop" element={<ProtectedRoute element={Shop} />} />
                    <Route path="/shop/meats" element={<ProtectedRoute element={Meats} />} />
                    <Route path="/shop/grains" element={<ProtectedRoute element={Grains} />} />
                    <Route path="/shop/hygiene" element={<ProtectedRoute element={Hygiene} />} />
                    <Route path="/shop/snacks" element={<ProtectedRoute element={Snacks} />} />
                    <Route path="/shop/dairy" element={<ProtectedRoute element={Dairy} />} />
                    <Route path="/shop/cleaning" element={<ProtectedRoute element={Cleaning} />} />
                    <Route path="/shop/fruits" element={<ProtectedRoute element={Fruits} />} />
                    <Route path="/cart" element={<ProtectedRoute element={Cart} />} />
                    <Route path="/delivery" element={<ProtectedRoute element={Delivery} />} />
                    <Route path="/address" element={<ProtectedRoute element={Address} />} />
                    <Route path="/product/:data" element={<ProtectedRoute element={Product} />} />
                    <Route path="/paymentmethod" element={<ProtectedRoute element={PaymentMethod} />} />
                    <Route path="/historial/:cartId" element={<ProtectedRoute element={Historial} />} />
                    <Route path="/admin" element={<ProtectedRoute element={Admin} adminOnly />} />
                    <Route path="/adminusers" element={<ProtectedRoute element={AdminUsers} adminOnly />} />
                    <Route path="/adminproducts" element={<ProtectedRoute element={AdminProducts} adminOnly />} />
                    <Route path="/adminsales" element={<ProtectedRoute element={AdminSales} adminOnly />} />
                    <Route path="/adminchat" element={<ProtectedRoute element={AdminChat} adminOnly />} />
                    <Route path="/adminnotifications" element={<ProtectedRoute element={AdminNotifications} adminOnly />} />
                    <Route path="/admindelivery" element={<ProtectedRoute element={AdminDelivery} adminOnly />} />
                </Routes>
            </PageTransition>
        </Router>
    );
};

export default AppRouter;
