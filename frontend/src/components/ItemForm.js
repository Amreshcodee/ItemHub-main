import React, { useState, useEffect } from 'react';

const ItemForm = ({ item, onSubmit, onCancel, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price ? String(item.price) : '',
        category: item.category || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{item ? 'Edit Item' : 'Add New Item'}</h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
            errors.name ? 'border-red-500' : 'focus:border-blue-300'
          }`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
            errors.description ? 'border-red-500' : 'focus:border-blue-300'
          }`}
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
          Price
        </label>
        <input
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
            errors.price ? 'border-red-500' : 'focus:border-blue-300'
          }`}
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>
      
      <div className="mb-6">
        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
          Category
        </label>
        {categories.length > 0 ? (
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
              errors.category ? 'border-red-500' : 'focus:border-blue-300'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            <option value="new">+ Add new category</option>
          </select>
        ) : (
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
              errors.category ? 'border-red-500' : 'focus:border-blue-300'
            }`}
            placeholder="Enter a category"
          />
        )}
        {formData.category === 'new' && (
          <input
            type="text"
            name="category"
            value=""
            onChange={handleChange}
            className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter a new category"
          />
        )}
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded"
        >
          {item ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;