import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../layout/Navbar';

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const Dashboard: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/sweets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSweets(res.data.sweets || res.data);
    } catch {
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-lavender-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">
          🍬 Sweet Shop Dashboard
        </h1>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <div
                key={sweet._id}
                className="bg-white rounded-xl border border-violet-100 p-5 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {sweet.name}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {sweet.category}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-violet-700 font-semibold text-lg">
                    ₹{sweet.price}
                  </span>
                  <span className="text-sm text-gray-600">
                    {sweet.quantity} left
                  </span>
                </div>

                <button
                  className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-medium transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
