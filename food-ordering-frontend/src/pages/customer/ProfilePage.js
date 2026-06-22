import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { Navbar, Footer } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: user?.address?.street || '', city: user?.address?.city || '', postalCode: user?.address?.postalCode || '',
  });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authAPI.updateProfile({ name: profile.name, phone: profile.phone, address: { street: profile.street, city: profile.city, postalCode: profile.postalCode } });
      updateUser({ name: profile.name, phone: profile.phone });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirm) { toast.error('Passwords do not match'); return; }
    if (pwd.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setChangingPwd(true);
    try {
      await authAPI.changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      toast.success('Password changed!');
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setChangingPwd(false); }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-content">
        <div className="container-sm">
          <div className="page-header">
            <h1 className="page-title">My Profile</h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile Info */}
            <div className="card">
              <div className="card-body">
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={18} color="var(--brand-orange)" /> Personal Information
                </h2>
                <form onSubmit={handleSaveProfile}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Full Name</label>
                      <input className="form-input" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="0771234567" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Street Address</label>
                      <input className="form-input" value={profile.street} onChange={e => setProfile({ ...profile, street: e.target.value })} placeholder="123 Main Street" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })} placeholder="Colombo" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input className="form-input" value={profile.postalCode} onChange={e => setProfile({ ...profile, postalCode: e.target.value })} placeholder="10100" />
                    </div>
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                </form>
              </div>
            </div>

            {/* Change Password */}
            <div className="card">
              <div className="card-body">
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lock size={18} color="var(--brand-orange)" /> Change Password
                </h2>
                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input className="form-input" type="password" value={pwd.currentPassword} onChange={e => setPwd({ ...pwd, currentPassword: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input className="form-input" type="password" value={pwd.newPassword} onChange={e => setPwd({ ...pwd, newPassword: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input className="form-input" type="password" value={pwd.confirm} onChange={e => setPwd({ ...pwd, confirm: e.target.value })} />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={changingPwd}>{changingPwd ? 'Changing...' : 'Change Password'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
