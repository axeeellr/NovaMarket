import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import Home from './views/Home';
import Notifications from './views/Notifications';
import Profile from './views/Profile';
import Scanner from './views/Scanner';
import Shop from './views/Shop';
import Login from './views/Login';
import Product from './views/Product';
import Cart from './views/Cart';

const AppRouter = () => {

  const isAuthenticated = localStorage.getItem('isAuthenticated');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={isAuthenticated === 'true' ? <Profile /> : <Navigate to="/login" />}/>
        <Route path="/scanner" element={isAuthenticated === 'true' ? <Scanner /> : <Navigate to="/login" />}/>
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={isAuthenticated === 'true' ? <Cart /> : <Navigate to="/login" />}/>
        <Route path="/product/:data" element={isAuthenticated === 'true' ? <Product /> : <Navigate to="/login" />}/>
      </Routes>
    </Router>
  );
}

export default AppRouter;
