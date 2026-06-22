import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Spinner } from '../../components/common';
import { foodAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Pizza', 'Burger', 'Cake', 'Drinks', 'Sides', 'Desserts', 'Other'];
const EMPTY_FORM = { name: '', description: '', price: '', category: 'Pizza', preparationTime: 20, isAvailable: true };

export default function AdminFood() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [catFilter, setCatFilter] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (catFilter) params.category = catFilter;
      const res = await foodAPI.getAll(params);
      setItems(res.data.data);
    } catch { toast.error('Failed to load food items'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, [catFilter]);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (item) => { setEditing(item._id); setForm({ name: item.name, description: item.description, price: item.price, category: item.category, preparationTime: item.preparationTime, isAvailable: item.isAvailable }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) { toast.error('Name, description and price are required'); return; }
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price), preparationTime: Number(form.preparationTime) };
      if (editing) { await foodAPI.update(editing, data); toast.success('Food item updated!'); }
      else { await foodAPI.create(data); toast.success('Food item added!'); }
      setShowModal(false);
      fetchItems();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await foodAPI.delete(id); toast.success('Deleted'); fetchItems(); }
    catch { toast.error('Delete failed'); }
  };

  const handleToggle = async (id) => {
    try { await foodAPI.toggleAvailability(id); fetchItems(); }
    catch { toast.error('Failed'); }
  };

  const EMOJI = { Pizza: '🍕', Burger: '🍔', Cake: '🎂', Drinks: '🥤', Sides: '🍟', Desserts: '🍰', Other: '🍽️' };

  return (
    <AdminLayout title="Food Items">
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Menu Management</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <select className="form-input form-select" style={{ width: 170 }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Item</button>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Prep Time</th><th>Available</th><th>Actions</th></tr></thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--brand-grey)' }}>No food items</td></tr>
              ) : items.map(item => (
                <tr key={item._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.5rem' }}>{EMOJI[item.category] || '🍽️'}</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>{item.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--brand-grey)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-orange">{item.category}</span></td>
                  <td style={{ fontWeight: 700 }}>Rs. {item.price.toLocaleString()}</td>
                  <td style={{ color: 'var(--brand-grey)', fontSize: '0.85rem' }}>{item.preparationTime} min</td>
                  <td>
                    <button onClick={() => handleToggle(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.isAvailable ? 'var(--brand-success)' : 'var(--brand-grey)' }}>
                      {item.isAvailable ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}><Pencil size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id, item.name)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Food Item' : 'Add Food Item'}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pepperoni Pizza" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the dish..." style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Price (Rs.) *</label>
                    <input className="form-input" type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prep Time (min)</label>
                    <input className="form-input" type="number" min="1" value={form.preparationTime} onChange={e => setForm({ ...form, preparationTime: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} style={{ width: 16, height: 16 }} />
                    <span className="form-label" style={{ margin: 0 }}>Available for ordering</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Item' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
