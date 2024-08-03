import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faTrash, faSignOut, faUndo } from '@fortawesome/free-solid-svg-icons';
import '../css/adminusers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [bannedUsers, setBannedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch users and banned users from the backend
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get('http://localhost:1001/users');
                const bannedResponse = await axios.get('http://localhost:1001/banned-users');
                setUsers(usersResponse.data);
                setBannedUsers(bannedResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:1001/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleBan = async (id) => {
        try {
            const userToBan = users.find(user => user.id === id);
            await axios.post('http://localhost:1001/ban-user', { userId: id });
            setBannedUsers([...bannedUsers, userToBan]);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error banning user:', error);
        }
    };

    const handleUnban = async (id) => {
        try {
            const userToUnban = bannedUsers.find(user => user.id === id);
            await axios.post('http://localhost:1001/unban-user', { userId: id });
            setUsers([...users, userToUnban]);
            setBannedUsers(bannedUsers.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error unbanning user:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredBannedUsers = bannedUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="admin__header">
                <h1>Gestión de usuarios de NovaMarket</h1>
                <button>Cerrar Sesión<FontAwesomeIcon icon={faSignOut} /></button>
            </div>
            <div className="admin-panel">
                <input
                    type="text"
                    placeholder="Nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => handleBan(user.id)}>
                                        <FontAwesomeIcon icon={faBan} /> Banear
                                    </button>
                                    <button onClick={() => handleDelete(user.id)}>
                                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <h2>Usuarios Baneados</h2>
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBannedUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => handleUnban(user.id)}>
                                        <FontAwesomeIcon icon={faUndo} /> Desbanear
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminUsers;
