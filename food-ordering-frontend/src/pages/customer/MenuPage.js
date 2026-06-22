import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Navbar, Footer, Spinner } from '../../components/common';
import { CartDrawer } from '../../components/customer/CartDrawer';
import { FoodCard } from '../../components/customer/FoodCard';
import { foodAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Cake', 'Drinks', 'Sides', 'Desserts'];

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = { available: true };
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const res = await foodAPI.getAll(params);
      setItems(res.data.data);
    } catch {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [category]);
  
  // Debounced search
  useEffect(() => {
    const t = setTimeout(fetchItems, 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="page-wrapper">
      <Navbar />
      <CartDrawer />
      <main className="page-content">
        <div className="container">
          <div className="page-header flex-between" style={{ flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="page-title">Our Menu</h1>
              <p className="page-subtitle">{items.length} items available</p>
            </div>
            <div className="search-bar" style={{ width: 280 }}>
              <Search size={18} className="search-icon" />
              <input className="form-input" placeholder="Search dishes..." value={search}
                onChange={(e) => setSearch(e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>

          <div className="category-pills">
            {CATEGORIES.map((c) => (
              <button key={c} className={`category-pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          {loading ? <Spinner /> : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍽️</div>
              <div className="empty-state-title">No items found</div>
              <p className="empty-state-text">Try a different category or search term</p>
            </div>
          ) : (
            <div className="food-grid">
              {items.map((item) => <FoodCard key={item._id} item={item} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
