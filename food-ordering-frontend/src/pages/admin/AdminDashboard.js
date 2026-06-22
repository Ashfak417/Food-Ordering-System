import React, { useEffect, useState } from 'react';
import { ShoppingBag, Users, UtensilsCrossed, DollarSign } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Spinner } from '../../components/common';
import { getStatusBadge } from '../../components/common/OrderStatus';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(r => setStats(r.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, sub: `${stats.paidOrders} paid orders`, icon: <DollarSign size={20} />, color: '#22C55E' },
    { label: 'Total Orders', value: stats.totalOrders, sub: `${stats.pendingOrders} pending`, icon: <ShoppingBag size={20} />, color: 'var(--brand-orange)' },
    { label: 'Customers', value: stats.totalCustomers, sub: 'registered users', icon: <Users size={20} />, color: '#3B82F6' },
    { label: 'Menu Items', value: stats.totalFoodItems, sub: 'food items', icon: <UtensilsCrossed size={20} />, color: '#8B5CF6' },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      {loading ? <Spinner /> : (
        <>
          <div className="stats-grid">
            {cards.map(card => (
              <div key={card.label} className="stat-card">
                <div className="stat-card-icon" style={{ background: card.color + '18', color: card.color }}>{card.icon}</div>
                <div className="stat-card-label">{card.label}</div>
                <div className="stat-card-value">{card.value}</div>
                <div className="stat-card-sub">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Order Status Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="table-wrapper">
              <div style={{ padding: '16px 20px', borderBottom: '1.5px solid var(--brand-border)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Orders by Status</div>
              <table className="table">
                <thead><tr><th>Status</th><th>Count</th></tr></thead>
                <tbody>
                  {(stats.statusBreakdown || []).map(row => (
                    <tr key={row._id}><td>{getStatusBadge(row._id)}</td><td style={{ fontWeight: 700 }}>{row.count}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-wrapper">
              <div style={{ padding: '16px 20px', borderBottom: '1.5px solid var(--brand-border)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Quick Stats</div>
              <div style={{ padding: 20 }}>
                {[
                  { label: 'Avg. Order Value', value: stats.totalOrders ? `Rs. ${Math.round(stats.totalRevenue / (stats.paidOrders || 1)).toLocaleString()}` : 'N/A' },
                  { label: 'Pending Orders', value: stats.pendingOrders },
                  { label: 'Menu Items', value: stats.totalFoodItems },
                ].map(item => (
                  <div key={item.label} className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--brand-border)', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--brand-grey)' }}>{item.label}</span>
                    <span style={{ fontWeight: 700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
