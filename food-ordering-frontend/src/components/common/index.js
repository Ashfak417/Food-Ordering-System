import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalCount, setIsOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          🍕 Foodi<span>e</span>
        </Link>
        <div className="navbar-links">
          {user && !isAdmin && (
            <>
              <NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Menu</NavLink>
              <NavLink to="/my-orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>My Orders</NavLink>
            </>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={16} /> Admin
            </NavLink>
          )}
          {user ? (
            <>
              {!isAdmin && (
                <button className="cart-btn" onClick={() => setIsOpen(true)}>
                  <ShoppingCart size={18} />
                  Cart
                  {totalCount > 0 && <span className="cart-count">{totalCount}</span>}
                </button>
              )}
              <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <User size={16} /> {user.name.split(' ')[0]}
              </NavLink>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => (
  <footer className="footer">
    <p>© 2025 <span>Foodie</span> — Built with ❤️ in Sri Lanka</p>
  </footer>
);

export const Spinner = () => (
  <div className="spinner-wrapper"><div className="spinner" /></div>
);

export const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  const navigate = React.useRef(useNavigate());

  React.useEffect(() => {
    if (!user) navigate.current('/login');
    else if (role && user.role !== role) navigate.current(user.role === 'admin' ? '/admin' : '/menu');
  }, [user, role]);

  if (!user) return null;
  if (role && user.role !== role) return null;
  return children;
};
