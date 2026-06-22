import React from 'react';

export const getStatusBadge = (status) => {
  const map = {
    Pending: 'badge-yellow',
    Confirmed: 'badge-blue',
    Preparing: 'badge-orange',
    'Out for Delivery': 'badge-blue',
    Delivered: 'badge-green',
    Cancelled: 'badge-red',
  };
  return <span className={`badge ${map[status] || 'badge-grey'}`}>{status}</span>;
};

export const getPaymentBadge = (status) => {
  const map = { Paid: 'badge-green', Pending: 'badge-yellow', Failed: 'badge-red', Refunded: 'badge-grey' };
  return <span className={`badge ${map[status] || 'badge-grey'}`}>{status}</span>;
};

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

export const StatusTracker = ({ currentStatus }) => {
  const steps = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentIdx = steps.indexOf(currentStatus);

  if (currentStatus === 'Cancelled') {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'var(--brand-error)', fontWeight: 600 }}>❌ Order Cancelled</div>;
  }

  return (
    <div className="status-tracker">
      {steps.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <div key={step} className={`status-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
            <div className="status-dot">{isDone ? '✓' : i + 1}</div>
            <div className="status-label">{step}</div>
          </div>
        );
      })}
    </div>
  );
};
