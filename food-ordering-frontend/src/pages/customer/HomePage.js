import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Clock } from 'lucide-react';
import { Navbar, Footer } from '../components/common';
import { CartDrawer } from '../components/customer/CartDrawer';

const features = [
  { icon: <Zap size={22} />, title: 'Fast Delivery', desc: 'Hot food delivered to your door in 45 minutes or less.' },
  { icon: <Shield size={22} />, title: 'Safe Payments', desc: 'Secure checkout via PayHere — Sri Lanka\'s trusted gateway.' },
  { icon: <Clock size={22} />, title: 'Live Tracking', desc: 'Track your order status from kitchen to your doorstep.' },
];

const categories = [
  { emoji: '🍕', name: 'Pizza' }, { emoji: '🍔', name: 'Burger' },
  { emoji: '🎂', name: 'Cake' }, { emoji: '🥤', name: 'Drinks' },
  { emoji: '🍟', name: 'Sides' }, { emoji: '🍰', name: 'Desserts' },
];

export default function HomePage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <CartDrawer />

      {/* Hero */}
      <section className="hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="hero-title">
            Order Food <span>You Love</span>,<br />Delivered Fast
          </h1>
          <p className="hero-sub">Pizza, burgers, cakes and more — fresh from the kitchen to your door anywhere in Sri Lanka.</p>
          <div className="flex gap-1">
            <Link to="/menu" className="btn btn-primary btn-lg">Browse Menu 🍕</Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Sign Up Free</Link>
          </div>
          <div className="hero-emoji">🍕</div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: 32, textAlign: 'center' }}>
            What are you craving?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
            {categories.map((cat) => (
              <Link key={cat.name} to={`/menu?category=${cat.name}`} className="card card-hover" style={{ textAlign: 'center', padding: '24px 16px', cursor: 'pointer' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{cat.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 0', background: 'var(--brand-light-grey)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: '28px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--brand-orange-dim)', color: 'var(--brand-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--brand-grey)', fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
