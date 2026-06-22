import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const DELIVERY_FEE = 250;

const getFoodEmoji = (category) => {
  const map = { Pizza: '🍕', Burger: '🍔', Cake: '🎂', Drinks: '🥤', Sides: '🍟', Desserts: '🍰', Other: '🍽️' };
  return map[category] || '🍽️';
};

export const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQty, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const total = subtotal + DELIVERY_FEE;

  const handleCheckout = () => {
    if (!user) { navigate('/login'); setIsOpen(false); return; }
    navigate('/checkout');
    setIsOpen(false);
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-header">
          <span className="cart-title">Your Cart 🛒</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setIsOpen(false)}><X size={20} /></button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <div className="empty-state-title">Cart is empty</div>
              <p className="empty-state-text">Add some delicious food!</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item._id}>
                <div style={{ fontSize: '2rem' }}>{getFoodEmoji(item.category)}</div>
                <div style={{ flex: 1 }}>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">Rs. {item.price.toLocaleString()} each</div>
                  <div className="cart-qty">
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.quantity - 1)}><Minus size={14} /></button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.quantity + 1)}><Plus size={14} /></button>
                    <button className="qty-btn" onClick={() => removeItem(item._id)} style={{ marginLeft: 'auto', color: '#EF4444' }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
            <div className="cart-summary-row"><span>Delivery fee</span><span>Rs. {DELIVERY_FEE}</span></div>
            <div className="cart-summary-row total"><span>Total</span><span style={{ color: 'var(--brand-orange)' }}>Rs. {total.toLocaleString()}</span></div>
            <button className="btn btn-primary btn-full mt-2" onClick={handleCheckout}>
              <ShoppingBag size={18} /> Proceed to Checkout
            </button>
            <button className="btn btn-ghost btn-full btn-sm mt-1" onClick={clearCart}>Clear Cart</button>
          </div>
        )}
      </div>
    </>
  );
};
