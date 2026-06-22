import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Navbar, Footer } from '../../components/common';

export default function PaymentCancelledPage() {
  const { orderId } = useParams();
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-content">
        <div className="container-sm">
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <XCircle size={64} color="var(--brand-error)" style={{ margin: '0 auto 20px' }} />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Payment Cancelled</h1>
            <p style={{ color: 'var(--brand-grey)', marginBottom: 32 }}>
              Your payment was cancelled. Your order is still saved — you can retry payment or place a new order.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {orderId && (
                <Link to={`/order-confirmation/${orderId}`} className="btn btn-primary">View Order</Link>
              )}
              <Link to="/menu" className="btn btn-secondary">Back to Menu</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
