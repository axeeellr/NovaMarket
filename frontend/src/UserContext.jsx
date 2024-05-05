import React, { createContext, useState, useEffect, useContext } from 'react';
import { encryptData, decryptData } from './CryptoUtils';  // Asegúrate de usar la ruta correcta a tu archivo

const UserContext = createContext();

export function UserProvider({ children }) {
    // Inicializar el estado del usuario y `isAuthenticated` desde `localStorage`
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? decryptData(storedUser) : null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
        return storedIsAuthenticated ? decryptData(storedIsAuthenticated) : false;
    });

    useEffect(() => {
        // Sincronizar `localStorage` con el estado del usuario
        const encryptedUser = encryptData(user);
        localStorage.setItem('user', encryptedUser);
        const encryptedIsAuthenticated = encryptData(isAuthenticated);
        localStorage.setItem('isAuthenticated', encryptedIsAuthenticated);
    }, [user, isAuthenticated]);

    const login = (user) => {
        // Iniciar sesión
        setUser(user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        // Cerrar sesión
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <UserContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
