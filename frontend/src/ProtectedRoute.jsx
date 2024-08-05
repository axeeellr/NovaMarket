// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ element: Component, adminOnly, ...rest }) => {
    const { user, isAuthenticated } = useUser();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;
