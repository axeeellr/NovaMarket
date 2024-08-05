import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';
import '../css/adminproducts.css';

import AdminHeader from '../components/HeaderAdmin';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ category: '', name: '', price: '', weight: '', img: '', code: '', brand: '', calories: '' });
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [editProduct, setEditProduct] = useState(null);

    const categories = ['Frutas y verduras', 'Carnes', 'Embutidos', 'Limpieza'];

    useEffect(() => {
        // Fetch products from the backend
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:1001/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:1001/products/${id}`);
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(`http://localhost:1001/products/${editProduct.id}`, editProduct);
            setProducts(products.map(product => product.id === editProduct.id ? editProduct : product));
            setEditProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleAddProduct = async () => {
        try {
            const response = await axios.post('http://localhost:1001/products', newProduct);
            setProducts([...products, { ...newProduct, id: response.data.id }]);
            setNewProduct({ category: '', name: '', price: '', weight: '', img: '', code: '', brand: '', calories: '' });
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editProduct) {
            setEditProduct({ ...editProduct, [name]: value });
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleCategorySelectChange = (e) => {
        const { value } = e.target;
        if (editProduct) {
            setEditProduct({ ...editProduct, category: value });
        } else {
            setNewProduct({ ...newProduct, category: value });
        }
    };

    const filteredProducts = selectedCategory === 'All' ? products : products.filter(product => product.category === selectedCategory);

    return (
        <>
            <AdminHeader/>
            <div className="admin-panel">
                <div className="add-product">
                    <h2>{editProduct ? 'Editar producto' : 'Añadir producto'}</h2>
                    <div className="add-product-form">
                        <input type="text" placeholder="Nombre" name="name" value={editProduct ? editProduct.name : newProduct.name} onChange={handleChange} />
                        <input type="text" placeholder="Código (nm-producto-0)" name="code" value={editProduct ? editProduct.code : newProduct.code} onChange={handleChange} />
                        <select name="category" value={editProduct ? editProduct.category : newProduct.category} onChange={handleCategorySelectChange}>
                            <option value="">Seleccionar categoría</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <input type="text" placeholder="Marca" name="brand" value={editProduct ? editProduct.brand : newProduct.brand} onChange={handleChange} />
                        <input type="number" placeholder="Precio" name="price" value={editProduct ? editProduct.price : newProduct.price} onChange={handleChange} />
                        <input type="text" placeholder="Peso (g, kg, lb, l)" name="weight" value={editProduct ? editProduct.weight : newProduct.weight} onChange={handleChange} />
                        <input type="text" placeholder="Calorías (kcal)" name="calories" value={editProduct ? editProduct.calories : newProduct.calories} onChange={handleChange} />
                        <input type="text" placeholder="Imagen URL" name="img" value={editProduct ? editProduct.img : newProduct.img} onChange={handleChange} />
                    </div>
                    <button onClick={editProduct ? handleSaveEdit : handleAddProduct}>
                        <FontAwesomeIcon icon={faPlus} /> {editProduct ? 'Guardar Cambios' : 'Añadir Producto'}
                    </button>
                </div>
                <div className="category-filter">
                    <label htmlFor="category-filter">Seleccionar categoría:</label>
                    <select id="category-filter" value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="All">Todas</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Peso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.category}</td>
                                <td><img src={product.img} alt={product.name} className="product-image" /></td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.weight}</td>
                                <td>
                                    <button onClick={() => handleEdit(product)}>
                                        <FontAwesomeIcon icon={faEdit} /> Editar
                                    </button>
                                    <button onClick={() => handleDelete(product.id)}>
                                        <FontAwesomeIcon icon={faTrash} /> Eliminar
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

export default AdminProducts;
