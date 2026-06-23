import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '', street: '', city: '', postalCode: '' });
  const [loading, setLoading] = useState(false);
  const { setUserFromStorage } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Name, email and password are required'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await authAPI.register({
        name: form.name, email: form.email, password: form.password, phone: form.phone,
        address: { street: form.street, city: form.city, postalCode: form.postalCode },
      });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUserFromStorage();
      toast.success('Account created! Welcome to Foodie 🎉');
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-food-emoji">🎂</div>
        <div className="auth-brand">Foodi<span>e</span></div>
        <p className="auth-tagline">Join thousands of happy customers ordering their favourite meals</p>
      </div>
      <div className="auth-right" style={{ overflowY: 'auto' }}>
        <div className="auth-form-box">
          <h1 className="auth-form-title">Create account</h1>
          <p className="auth-form-sub">Set your email and password to get started</p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Full name *</label>
                <input className="form-input" placeholder="Kavinda Perera" value={form.name} onChange={set('name')} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Email address *</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Phone (optional)</label>
                <input className="form-input" placeholder="0771234567" value={form.phone} onChange={set('phone')} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Delivery Address (optional)</label>
                <input className="form-input" placeholder="Street address" value={form.street} onChange={set('street')} style={{ marginBottom: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input className="form-input" placeholder="City" value={form.city} onChange={set('city')} />
                  <input className="form-input" placeholder="Postal code" value={form.postalCode} onChange={set('postalCode')} />
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 20, color: 'var(--brand-grey)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
