import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer, Spinner } from '../../components/common';
import { getStatusBadge, getPaymentBadge } from '../../components/common/OrderStatus';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(r => setOrders(r.data.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await orderAPI.cancel(id);
      toast.success('Order cancelled');
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: 'Cancelled' } : o));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-content">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>

          {loading ? <Spinner /> : orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <div className="empty-state-title">No orders yet</div>
              <p className="empty-state-text">Start by browsing our menu!</p>
              <Link to="/menu" className="btn btn-primary mt-2">Browse Menu</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {orders.map((order) => (
                <div key={order._id} className="card">
                  <div className="card-body">
                    <div className="flex-between" style={{ flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{order.orderId}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--brand-grey)', marginTop: 2 }}>
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {getStatusBadge(order.orderStatus)}
                        {getPaymentBadge(order.paymentStatus)}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: 'var(--brand-grey)', marginBottom: 12 }}>
                      {order.items.map(i => `${i.name} ×${i.quantity}`).join(' · ')}
                    </div>

                    <div className="flex-between">
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem' }}>
                        Rs. {order.totalAmount.toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['Pending', 'Confirmed'].includes(order.orderStatus) && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancel(order._id)}>Cancel</button>
                        )}
                        <Link to={`/order-confirmation/${order._id}`} className="btn btn-secondary btn-sm">View Details</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
