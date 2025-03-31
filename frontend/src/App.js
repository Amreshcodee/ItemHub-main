import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import ItemTable from './components/ItemTable';
import ItemForm from './components/ItemForm';
import AlertDialog from './components/AlertDialog';

function Main() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  
  const { protectAction } = useAuth();

  // Get unique categories from items
  const categories = [...new Set(items.map(item => item.category))];

  useEffect(() => {
    fetchItems();
  }, [searchTerm]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const url = searchTerm 
        ? `/api/items/?search=${encodeURIComponent(searchTerm)}` 
        : '/api/items/';
        
      const response = await fetch(url, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = protectAction('add a new item', async (itemData) => {
    try {
      const response = await fetch('/api/items/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
      
      await fetchItems();
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Failed to add item. Please try again.');
    }
  });

  const handleUpdateItem = protectAction('update this item', async (itemData) => {
    if (!editingItem) return;
    
    try {
      const response = await fetch(`/api/items/${editingItem.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      
      await fetchItems();
      setEditingItem(null);
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Failed to update item. Please try again.');
    }
  });

  const handleDeleteItem = protectAction('delete this item', async () => {
    if (!deletingItem) return;
    
    try {
      const response = await fetch(`/api/items/${deletingItem.id}/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      
      await fetchItems();
      setDeletingItem(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    }
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
            Item Management
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded inline-flex items-center"
              onClick={() => protectAction('add a new item', () => setShowAddForm(true))()}
            >
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Item
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <ItemTable 
            items={items} 
            onEdit={(item) => setEditingItem(item)} 
            onDelete={(item) => setDeletingItem(item)} 
          />
        )}
      </main>
      
      {/* Add/Edit Item Form Modal */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="max-w-lg w-full">
            <ItemForm
              item={editingItem}
              onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              onCancel={() => {
                setShowAddForm(false);
                setEditingItem(null);
              }}
              categories={categories}
            />
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <AlertDialog
        isOpen={!!deletingItem}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteItem}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

export default App;