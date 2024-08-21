import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../css/adminproducts.css';
import AdminHeader from '../components/HeaderAdmin';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ category: '', name: '', price: '', weight: '', code: '', brand: '', calories: '', type: '' });
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [editProduct, setEditProduct] = useState(null);
    const fileInput = useRef(null);

    const categories = ['Frutas y verduras', 'Carnes', 'Granos', 'Limpieza', 'Lácteos', 'Higiene', 'Snacks'];
    const types = ['Frutas y verduras', 'Carnes', "Arroz", 'Arroz Precocido', "Maíz", "Frijoles", "Lentejas", "Azúcar", "Sal", "Pan de caja", "Macarrones", "Aceite", "Sardina", "Jugos de caja", "Galletas", "Desinfectante", "Detergente en polvo", "Lavaplatos", "Lejía", "Suavizante", "Jabón de limpieza", "Bolsas plásticas para basura", "Leche", "Yogurt", "Flan", "Cofileche", "Huevos", "Queso", "Crema", "Shampoo", "Jabón de higiene personal", "Crema corporal", "Pasta dental", "Papel higiénico", "Protector solar", "Cereal", "Galletas", "Churros", "Pan dulce", "Chocolates", "Dulces"];

    useEffect(() => {
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
        const formData = new FormData();
        formData.append('name', editProduct.name);
        formData.append('code', editProduct.code);
        formData.append('brand', editProduct.brand);
        formData.append('calories', editProduct.calories);
        formData.append('price', editProduct.price);
        formData.append('weight', editProduct.weight);
        formData.append('category', editProduct.category);
        formData.append('type', editProduct.type);

        if (fileInput.current.files[0]) {
            formData.append('file', fileInput.current.files[0]);
        }

        try {
            await axios.put(`http://localhost:1001/products/${editProduct.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProducts(products.map(product => product.id === editProduct.id ? editProduct : product));
            setEditProduct(null);
            fileInput.current.value = null; // Limpiar el campo de archivo
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleAddProduct = async () => {
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('code', newProduct.code);
        formData.append('brand', newProduct.brand);
        formData.append('calories', newProduct.calories);
        formData.append('price', newProduct.price);
        formData.append('weight', newProduct.weight);
        formData.append('category', newProduct.category);
        formData.append('type', newProduct.type);

        if (fileInput.current.files[0]) {
            formData.append('file', fileInput.current.files[0]);
        }

        try {
            const response = await axios.post('http://localhost:1001/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProducts([...products, { ...newProduct, id: response.data.id }]);
            setNewProduct({ category: '', name: '', price: '', weight: '', code: '', brand: '', calories: '', type: ''});
            fileInput.current.value = null; // Limpiar el campo de archivo
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

    const handleTypeSelectChange = (e) => {
        const { value } = e.target;
        if (editProduct) {
            setEditProduct({ ...editProduct, type: value });
        } else {
            setNewProduct({ ...newProduct, type: value });
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
                        <input type="text" placeholder="Marca" name="brand" value={editProduct ? editProduct.brand : newProduct.brand} onChange={handleChange} />
                        <input type="number" placeholder="Precio" name="price" value={editProduct ? editProduct.price : newProduct.price} onChange={handleChange} />
                        <input type="text" placeholder="Peso (g, kg, lb, l)" name="weight" value={editProduct ? editProduct.weight : newProduct.weight} onChange={handleChange} />
                        <input type="text" placeholder="Calorías (kcal)" name="calories" value={editProduct ? editProduct.calories : newProduct.calories} onChange={handleChange} />
                        <select name="category" value={editProduct ? editProduct.category : newProduct.category} onChange={handleCategorySelectChange}>
                            <option value="">Seleccionar categoría</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select name="type" value={editProduct ? editProduct.type : newProduct.type} onChange={handleTypeSelectChange}>
                            <option value="">Seleccionar tipo</option>
                            {types.map(typ => (
                                <option key={typ} value={typ}>{typ}</option>
                            ))}
                        </select>
                        <input type="file" ref={fileInput} />
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
                            <th>Tipo</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Peso</th>
                            <th>Calorías</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.category}</td>
                                <td>{product.type}</td>
                                <td><img src={product.img} alt={product.name} style={{ width: '50px' }} /></td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.weight}</td>
                                <td>{product.calories}</td>
                                <td>
                                    <button onClick={() => handleEdit(product)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDelete(product.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
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
