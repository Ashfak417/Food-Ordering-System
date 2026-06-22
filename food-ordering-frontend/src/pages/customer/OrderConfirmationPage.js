import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Navbar, Footer, Spinner } from '../../components/common';
import { StatusTracker, getPaymentBadge } from '../../components/common/OrderStatus';
import { paymentAPI, orderAPI } from '../../services/api';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        // Try verify endpoint first (after PayHere redirect)
        const res = await paymentAPI.verify(orderId);
        // Then get full order
        const orderRes = await orderAPI.getOne(orderId);
        setOrder(orderRes.data.data);
      } catch {
        try {
          const orderRes = await orderAPI.getOne(orderId);
          setOrder(orderRes.data.data);
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orderId]);

  if (loading) return <><Navbar /><Spinner /></>;
  if (!order) return <><Navbar /><div className="container" style={{padding:'60px 0',textAlign:'center'}}>Order not found.</div></>;

  const isPaid = order.paymentStatus === 'Paid';
  const isFailed = order.paymentStatus === 'Failed';

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-content">
        <div className="container-sm">
          {/* Status Banner */}
          <div className="card" style={{ textAlign: 'center', padding: '40px 24px', marginBottom: 24 }}>
            {isPaid ? (
              <>
                <CheckCircle size={56} color="var(--brand-success)" style={{ margin: '0 auto 16px' }} />
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Order Confirmed! 🎉</h1>
                <p style={{ color: 'var(--brand-grey)' }}>Your payment was successful. We're preparing your order now.</p>
              </>
            ) : isFailed ? (
              <>
                <XCircle size={56} color="var(--brand-error)" style={{ margin: '0 auto 16px' }} />
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Payment Failed</h1>
                <p style={{ color: 'var(--brand-grey)' }}>Your payment could not be processed. Please try again.</p>
              </>
            ) : (
              <>
                <Clock size={56} color="var(--brand-warning)" style={{ margin: '0 auto 16px' }} />
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Payment Pending</h1>
                <p style={{ color: 'var(--brand-grey)' }}>We're waiting for payment confirmation.</p>
              </>
            )}
          </div>

          {/* Order Details */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body">
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Order Details</h2>
                {getPaymentBadge(order.paymentStatus)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div><div style={{ fontSize: '0.78rem', color: 'var(--brand-grey)', fontWeight: 600, marginBottom: 2 }}>ORDER ID</div><div style={{ fontWeight: 700 }}>{order.orderId}</div></div>
                <div><div style={{ fontSize: '0.78rem', color: 'var(--brand-grey)', fontWeight: 600, marginBottom: 2 }}>DATE</div><div>{new Date(order.createdAt).toLocaleDateString()}</div></div>
                <div><div style={{ fontSize: '0.78rem', color: 'var(--brand-grey)', fontWeight: 600, marginBottom: 2 }}>DELIVER TO</div><div>{order.deliveryAddress.street}, {order.deliveryAddress.city}</div></div>
                <div><div style={{ fontSize: '0.78rem', color: 'var(--brand-grey)', fontWeight: 600, marginBottom: 2 }}>ESTIMATED TIME</div><div>~45 minutes</div></div>
              </div>
              <div className="divider" />
              {/* Items */}
              {order.items.map((item, i) => (
                <div key={i} className="flex-between" style={{ padding: '8px 0', fontSize: '0.9rem' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="divider" />
              <div className="flex-between" style={{ fontSize: '0.9rem', marginBottom: 6 }}><span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
              <div className="flex-between" style={{ fontSize: '0.9rem', marginBottom: 10 }}><span>Delivery fee</span><span>Rs. {order.deliveryFee}</span></div>
              <div className="flex-between" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>
                <span>Total</span><span style={{ color: 'var(--brand-orange)' }}>Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Status Tracker */}
          {isPaid && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body">
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>Track Your Order</h2>
                <p style={{ color: 'var(--brand-grey)', fontSize: '0.85rem', marginBottom: 8 }}>Current status: <strong>{order.orderStatus}</strong></p>
                <StatusTracker currentStatus={order.orderStatus} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/my-orders" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>View All Orders</Link>
            <Link to="/menu" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Order More</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
