import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Spinner } from '../../components/common';
import { getStatusBadge, getPaymentBadge, ORDER_STATUSES } from '../../components/common/OrderStatus';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const res = await adminAPI.getOrders(params);
      setOrders(res.data.data);
      setTotalPages(res.data.pages);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, page]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Status updated');
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <AdminLayout title="Orders">
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>All Orders</h2>
        <select className="form-input form-select" style={{ width: 200 }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--brand-grey)' }}>No orders found</td></tr>
                ) : orders.map(order => (
                  <tr key={order._id}>
                    <td><div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{order.orderId}</div><div style={{ fontSize: '0.75rem', color: 'var(--brand-grey)' }}>{new Date(order.createdAt).toLocaleDateString()}</div></td>
                    <td><div style={{ fontWeight: 600 }}>{order.customer?.name}</div><div style={{ fontSize: '0.78rem', color: 'var(--brand-grey)' }}>{order.customer?.email}</div></td>
                    <td style={{ fontSize: '0.85rem' }}>{order.items?.length} item(s)</td>
                    <td style={{ fontWeight: 700 }}>Rs. {order.totalAmount?.toLocaleString()}</td>
                    <td>{getPaymentBadge(order.paymentStatus)}</td>
                    <td>{getStatusBadge(order.orderStatus)}</td>
                    <td>
                      <select className="form-input form-select" style={{ fontSize: '0.8rem', padding: '6px 32px 6px 8px' }}
                        value={order.orderStatus}
                        onChange={e => handleStatusChange(order._id, e.target.value)}>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
