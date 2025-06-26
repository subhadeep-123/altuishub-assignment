import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

function App() {
  const [apartments, setApartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    sort: 'newest_first'
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    bedroom_type: '1',
    location: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    is_available: true
  });

  // Fetch apartments
  const fetchApartments = async () => {
    try {
      let url = `${API}/apartments/?`;
      
      if (filters.search) url += `search=${filters.search}&`;
      if (filters.priceMin) url += `price_min=${filters.priceMin}&`;
      if (filters.priceMax) url += `price_max=${filters.priceMax}&`;
      if (filters.bedrooms) url += `bedrooms=${filters.bedrooms}&`;
      if (filters.sort) url += `sort=${filters.sort}&`;

      const response = await axios.get(url);
      setApartments(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, [filters]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingApartment) {
        await axios.put(`${API}/apartments/${editingApartment.id}/`, formData);
      } else {
        await axios.post(`${API}/apartments/`, formData);
      }
      setShowForm(false);
      setEditingApartment(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        bedroom_type: '1',
        location: '',
        city: 'Mumbai',
        state: 'Maharashtra',
        is_available: true
      });
      fetchApartments();
    } catch (error) {
      console.error('Error saving apartment:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Delete this apartment?')) {
      try {
        await axios.delete(`${API}/apartments/${id}/`);
        fetchApartments();
      } catch (error) {
        console.error('Error deleting apartment:', error);
      }
    }
  };

  // Handle edit
  const handleEdit = (apartment) => {
    setEditingApartment(apartment);
    setFormData({
      title: apartment.title,
      description: apartment.description,
      price: apartment.price,
      bedroom_type: apartment.bedroom_type,
      location: apartment.location,
      city: apartment.city,
      state: apartment.state,
      is_available: apartment.is_available
    });
    setShowForm(true);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Real Estate Portal</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Apartment
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Min Price"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">All Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedroom</option>
              <option value="3">3 Bedroom</option>
            </select>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="newest_first">Newest First</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
            </select>
          </div>
          
          {/* Quick filter for ₹15k-₹25k range */}
          <div className="mt-4">
            <button
              onClick={() => {
                handleFilterChange('priceMin', '15000');
                handleFilterChange('priceMax', '25000');
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              ₹15,000 - ₹25,000 Range
            </button>
            <button
              onClick={() => {
                handleFilterChange('priceMin', '');
                handleFilterChange('priceMax', '');
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm ml-2"
            >
              Clear Price Filter
            </button>
          </div>
        </div>

        {/* Apartments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apartment) => (
            <div key={apartment.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">{apartment.title}</h3>
              <p className="text-gray-600 mb-3">{apartment.description}</p>
              
              <div className="mb-3">
                <p className="text-2xl font-bold text-green-600">{formatPrice(apartment.price)}</p>
                <p className="text-sm text-gray-500">per month</p>
              </div>

              <div className="mb-3">
                <p className="text-sm"><strong>Bedrooms:</strong> {apartment.bedroom_display}</p>
                <p className="text-sm"><strong>Location:</strong> {apartment.location}</p>
                <p className="text-sm"><strong>City:</strong> {apartment.city}, {apartment.state}</p>
              </div>

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded ${
                  apartment.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {apartment.is_available ? 'Available' : 'Not Available'}
                </span>
                
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(apartment)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(apartment.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {apartments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No apartments found</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md m-4">
            <h2 className="text-xl font-bold mb-4">
              {editingApartment ? 'Edit Apartment' : 'Add Apartment'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bedrooms</label>
                  <select
                    value={formData.bedroom_type}
                    onChange={(e) => setFormData({...formData, bedroom_type: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedroom</option>
                    <option value="3">3 Bedroom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                    className="mr-2"
                  />
                  Available for rent
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingApartment(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingApartment ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
