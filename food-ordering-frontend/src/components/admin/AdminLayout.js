import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, UtensilsCrossed, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
  { to: '/admin/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
  { to: '/admin/customers', icon: <Users size={18} />, label: 'Customers' },
  { to: '/admin/food', icon: <UtensilsCrossed size={18} />, label: 'Food Items' },
];

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">🍕 Foodi<span>e</span> Admin</div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', padding: '8px 12px', marginBottom: 4 }}>
            {user?.name}
          </div>
          <button className="admin-nav-item" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <div className="admin-topbar">
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>{title}</h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--brand-grey)' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="admin-page">{children}</div>
      </div>
    </div>
  );
}
