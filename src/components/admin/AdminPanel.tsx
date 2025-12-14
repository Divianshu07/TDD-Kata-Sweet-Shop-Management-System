import React, { useState, useEffect } from 'react';
import Navbar from '../layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'chocolate',
    price: '',
    quantity: '',
    image: '',
    description: ''
  });

  const categories = ['chocolate', 'candy', 'gummy', 'hard candy', 'lollipop'];

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchSweets();
  }, [user, navigate]);

  const fetchSweets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/sweets', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const sweetsData = response.data.sweets || response.data;
      setSweets(Array.isArray(sweetsData) ? sweetsData : []);
    } catch (err) {
      setError('Failed to fetch sweets');
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (Number(formData.price) <= 0 || Number(formData.quantity) < 0) {
      setError('Price and quantity must be valid positive values');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const sweetData = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      };

      if (editingSweet) {
        await axios.put(
          `http://localhost:3001/api/sweets/${editingSweet._id}`,
          sweetData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/sweets',
          sweetData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      cancelForm();
      fetchSweets();
    } catch (err) {
      setError('Failed to save sweet');
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      image: sweet.image || '',
      description: sweet.description || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (sweetId: string) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/sweets/${sweetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSweets();
    } catch {
      setError('Failed to delete sweet');
    }
  };

  const handleRestock = async (sweetId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3001/api/sweets/${sweetId}/restock`,
        { quantity: 10 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSweets();
    } catch {
      setError('Failed to restock sweet');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingSweet(null);
    setFormData({
      name: '',
      category: 'chocolate',
      price: '',
      quantity: '',
      image: '',
      description: ''
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64 text-xl">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Panel
              </h1>
              <p className="text-sm text-gray-500">
                Manage sweets inventory • Built by Divianshu Chandel
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md"
            >
              + Add New Sweet
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Add / Edit Form */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Sweet Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-3 py-2 border rounded-md"
                  />

                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="px-3 py-2 border rounded-md"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Price (₹)"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="px-3 py-2 border rounded-md"
                  />

                  <input
                    type="number"
                    placeholder="Quantity"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="flex space-x-4">
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-md">
                    {editingSweet ? 'Update' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="bg-gray-300 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          {sweets.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No sweets available. Start by adding new sweets 🍬
            </p>
          ) : (
            <div className="bg-white shadow rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Name', 'Category', 'Price', 'Quantity', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sweets.map(sweet => (
                    <tr key={sweet._id}>
                      <td className="px-6 py-4 font-medium">{sweet.name}</td>
                      <td className="px-6 py-4 capitalize">{sweet.category}</td>
                      <td className="px-6 py-4">₹{sweet.price}</td>
                      <td className="px-6 py-4">{sweet.quantity}</td>
                      <td className="px-6 py-4 space-x-3">
                        <button onClick={() => handleEdit(sweet)} className="text-indigo-600">Edit</button>
                        <button onClick={() => handleRestock(sweet._id)} className="text-green-600">Restock</button>
                        <button onClick={() => handleDelete(sweet._id)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
