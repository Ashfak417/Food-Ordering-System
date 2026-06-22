import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Spinner } from '../../components/common';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      const res = await adminAPI.getCustomers(params);
      setCustomers(res.data.data);
      setTotalPages(res.data.pages);
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCustomers(); }, [page]);
  useEffect(() => {
    const t = setTimeout(fetchCustomers, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleViewCustomer = async (id) => {
    setSelectedCustomer(id);
    setDetailLoading(true);
    try {
      const res = await adminAPI.getCustomer(id);
      setCustomerDetail(res.data.data);
    } catch { toast.error('Failed to load customer details'); }
    finally { setDetailLoading(false); }
  };

  const handleToggleStatus = async (id, name) => {
    try {
      await adminAPI.toggleCustomerStatus(id);
      toast.success(`Customer updated`);
      fetchCustomers();
      if (selectedCustomer === id) handleViewCustomer(id);
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <AdminLayout title="Customers">
      <div style={{ display: 'grid', gridTemplateColumns: selectedCustomer ? '1fr 360px' : '1fr', gap: 24 }}>
        {/* List */}
        <div>
          <div className="flex-between" style={{ marginBottom: 16, gap: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>All Customers</h2>
            <div className="search-bar" style={{ width: 260 }}>
              <Search size={16} className="search-icon" />
              <input className="form-input" placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>

          {loading ? <Spinner /> : (
            <>
              <div className="table-wrapper">
                <table className="table">
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--brand-grey)' }}>No customers found</td></tr>
                    ) : customers.map(c => (
                      <tr key={c._id} style={{ cursor: 'pointer' }} onClick={() => handleViewCustomer(c._id)}>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--brand-grey)' }}>{c.email}</td>
                        <td style={{ fontSize: '0.85rem' }}>{c.phone || '—'}</td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--brand-grey)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td><span className={`badge ${c.isActive ? 'badge-green' : 'badge-red'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td onClick={e => e.stopPropagation()}>
                          <button className={`btn btn-sm ${c.isActive ? 'btn-danger' : 'btn-secondary'}`} onClick={() => handleToggleStatus(c._id, c.name)}>
                            {c.isActive ? 'Deactivate' : 'Activate'}
                          </button>
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
        </div>

        {/* Detail Panel */}
        {selectedCustomer && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 80 }}>
            <div className="card-body">
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Customer Details</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedCustomer(null); setCustomerDetail(null); }}>✕</button>
              </div>
              {detailLoading ? <Spinner /> : customerDetail ? (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{customerDetail.customer.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--brand-grey)' }}>{customerDetail.customer.email}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--brand-grey)' }}>{customerDetail.customer.phone || 'No phone'}</div>
                  </div>
                  <div className="divider" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div className="stat-card" style={{ padding: '12px 14px' }}>
                      <div className="stat-card-label">Orders</div>
                      <div className="stat-card-value" style={{ fontSize: '1.3rem' }}>{customerDetail.orderCount}</div>
                    </div>
                    <div className="stat-card" style={{ padding: '12px 14px' }}>
                      <div className="stat-card-label">Total Spent</div>
                      <div className="stat-card-value" style={{ fontSize: '1rem' }}>Rs. {customerDetail.totalSpent.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 10 }}>Recent Orders</div>
                  {customerDetail.recentOrders.length === 0 ? (
                    <p style={{ color: 'var(--brand-grey)', fontSize: '0.85rem' }}>No orders yet</p>
                  ) : customerDetail.recentOrders.map(o => (
                    <div key={o._id} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--brand-border)', fontSize: '0.82rem' }}>
                      <div><div style={{ fontWeight: 600 }}>{o.orderId}</div><div style={{ color: 'var(--brand-grey)' }}>{new Date(o.createdAt).toLocaleDateString()}</div></div>
                      <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 700 }}>Rs. {o.totalAmount.toLocaleString()}</div><span className={`badge ${o.paymentStatus === 'Paid' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.7rem' }}>{o.paymentStatus}</span></div>
                    </div>
                  ))}
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
