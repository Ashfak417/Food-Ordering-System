import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard } from 'lucide-react';
import { Navbar, Footer } from '../../components/common';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, paymentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const DELIVERY_FEE = 250;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
  });
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const total = subtotal + DELIVERY_FEE;

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.postalCode) {
      toast.error('Please fill in your delivery address');
      return;
    }
    setLoading(true);
    try {
      // 1. Place the order
      const orderRes = await orderAPI.place({
        items: items.map((i) => ({ foodItem: i._id, quantity: i.quantity })),
        deliveryAddress: address,
        specialInstructions: instructions,
      });
      const order = orderRes.data.data;

      // 2. Initiate PayHere payment
      const payRes = await paymentAPI.initiate(order._id);
      const payData = payRes.data.data;

      clearCart();

      // 3. Submit to PayHere via hidden form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payData.payhere_url;

      const fields = { ...payData };
      delete fields.payhere_url;

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-content">
        <div className="container-sm">
          <div className="page-header">
            <h1 className="page-title">Checkout</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
            {/* Left */}
            <div>
              {/* Delivery Address */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-body">
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={18} color="var(--brand-orange)" /> Delivery Address
                  </h2>
                  <div className="form-group">
                    <label className="form-label">Street Address *</label>
                    <input className="form-input" placeholder="123 Main Street" value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input className="form-input" placeholder="Colombo" value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code *</label>
                      <input className="form-input" placeholder="10100" value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special Instructions</label>
                    <textarea className="form-input" rows={3} placeholder="e.g. Ring the doorbell, extra napkins..." value={instructions}
                      onChange={(e) => setInstructions(e.target.value)} style={{ resize: 'vertical' }} />
                  </div>
                </div>
              </div>

              {/* Payment notice */}
              <div className="card" style={{ padding: '16px 20px', background: 'var(--brand-orange-dim)', border: '1.5px solid var(--brand-orange)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <CreditCard size={20} color="var(--brand-orange)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Secure Payment via PayHere</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--brand-grey)' }}>
                      You'll be redirected to PayHere Sandbox to complete your payment. Supports Visa, Mastercard, and internet banking.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="card" style={{ position: 'sticky', top: 80 }}>
              <div className="card-body">
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>Order Summary</h2>
                {items.map((item) => (
                  <div key={item._id} className="flex-between" style={{ marginBottom: 10, fontSize: '0.9rem' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="divider" />
                <div className="flex-between" style={{ fontSize: '0.9rem', marginBottom: 8 }}>
                  <span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex-between" style={{ fontSize: '0.9rem', marginBottom: 12 }}>
                  <span>Delivery fee</span><span>Rs. {DELIVERY_FEE}</span>
                </div>
                <div className="flex-between" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--brand-orange)' }}>Rs. {total.toLocaleString()}</span>
                </div>
                <button className="btn btn-primary btn-full btn-lg mt-2" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Placing Order...' : `Pay Rs. ${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
