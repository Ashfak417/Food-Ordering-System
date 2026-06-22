import React from 'react';
import { Plus, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const CATEGORY_EMOJI = {
  Pizza: '🍕', Burger: '🍔', Cake: '🎂', Drinks: '🥤',
  Sides: '🍟', Desserts: '🍰', Other: '🍽️',
};

export const FoodCard = ({ item }) => {
  const { addItem } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(item);
    toast.success(`${item.name} added to cart!`, { icon: '🛒' });
  };

  return (
    <div className="card card-hover food-card">
      <div className="food-card-image">
        {CATEGORY_EMOJI[item.category] || '🍽️'}
      </div>
      <div className="food-card-body">
        <div className="food-card-category">{item.category}</div>
        <div className="food-card-name">{item.name}</div>
        <div className="food-card-desc">{item.description}</div>
        <div className="food-card-footer">
          <div>
            <div className="food-card-price">Rs. {item.price.toLocaleString()}</div>
            {item.ratings > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--brand-grey)', marginTop: 2 }}>
                <Star size={12} fill="var(--brand-warning)" color="var(--brand-warning)" />
                {item.ratings} ({item.numReviews})
              </div>
            )}
          </div>
          {item.isAvailable ? (
            <button className="btn btn-primary btn-sm" onClick={handleAdd}>
              <Plus size={16} /> Add
            </button>
          ) : (
            <span className="badge badge-grey">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
};
