import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

function ApartmentCard({ apartment, onDelete }) {
  return (
    <div className="border p-4 rounded shadow mb-4 flex justify-between items-start">
      <div>
        <h2 className="font-bold text-lg">{apartment.location}</h2>
        <p>Rent: ₹{apartment.price}</p>
        <p>Bedrooms: {apartment.bedroom_type.replace('BHK', '')}</p>
        <p>Posted: {new Date(apartment.created_at || Date.now()).toLocaleDateString()}</p>
      </div>
      <div className="flex flex-col gap-2">
        <button className="bg-blue-500 text-white px-3 py-1 rounded">Update</button>
        <button onClick={() => onDelete(apartment.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
      </div>
    </div>
  );
}

function App() {
  const [apartments, setApartments] = useState([]);
  const [filters, setFilters] = useState({ city: '', min: '', max: '', sort: 'price' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastApartmentRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchApartments = async () => {
    setLoading(true);
    let ordering = filters.sort;
    let url = `${API}/apartments/?page=${page}&ordering=${ordering}`;
    if (filters.min) url += `&price__gte=${filters.min}`;
    if (filters.max) url += `&price__lte=${filters.max}`;
    if (filters.city) url += `&search=${filters.city}`;
    const res = await axios.get(url);
    setApartments(prev => [...prev, ...res.data]);
    if (res.data.length === 0) setHasMore(false);
    setLoading(false);
  };

  useEffect(() => {
    setApartments([]);
    setPage(1);
    setHasMore(true);
  }, [filters]);

  useEffect(() => {
    fetchApartments();
  }, [page, filters]);

  useEffect(() => {
    const interval = setInterval(() => {
      setApartments([]);
      setPage(1);
      setHasMore(true);
    }, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`${API}/apartments/${id}/`);
    setApartments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="flex gap-2 mb-4">
        <input className="border p-2" placeholder="Search by City" onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} />
        <input className="border p-2" type="number" placeholder="Min Rent" onChange={e => setFilters(f => ({ ...f, min: e.target.value }))} />
        <input className="border p-2" type="number" placeholder="Max Rent" onChange={e => setFilters(f => ({ ...f, max: e.target.value }))} />
        <select className="border p-2" onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-created_at">Newest</option>
          <option value="price,-created_at">Price + Date</option>
        </select>
      </div>
      <h1 className="text-xl font-bold mb-4">Apartments in India</h1>
      {apartments.map((ap, i) => {
        if (i === apartments.length - 1) {
          return <div ref={lastApartmentRef} key={ap.id}><ApartmentCard apartment={ap} onDelete={handleDelete} /></div>
        } else {
          return <ApartmentCard key={ap.id} apartment={ap} onDelete={handleDelete} />
        }
      })}
      {loading && <p className="text-center py-4">Loading more...</p>}
      {!hasMore && <p className="text-center text-gray-500 py-4">No more results</p>}
    </div>
  );
}

export default App;
