import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Camera, Shield, Bell, 
  ChevronRight, Save, LogOut, ArrowLeft,
  Loader2, CameraIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const C = {
  bg: 'var(--bg)',
  surface: 'var(--surface)',
  surfaceLight: 'var(--surface)',
  border: 'var(--border)',
  text: 'var(--text)',
  muted: 'var(--muted)',
  accent: '#22c55e',
  accentLight: '#4ade80',
  accentDark: '#16a34a',
  accentBg: 'rgba(34,197,94,0.1)',
};

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef(null);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [bio, setBio] = useState(user?.bio || 'An avid reader and book collector.');

  // Tab state
  const [activeTab, setActiveTab] = useState('general');

  // Security states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      setError('User ID not found. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('Saving profile for user:', user.id, { name, email, bio });
      const response = await fetch(`http://localhost:5000/api/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, avatar, bio }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
        login(data.user);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to save changes.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Connection failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSecurityError('Passwords do not match');
      return;
    }
    setLoading(true);
    setSecurityError('');
    setSecuritySuccess('');
    try {
      const response = await fetch(`http://localhost:5000/api/user/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setSecuritySuccess('Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSecurityError(data.message || 'Failed to update password');
      }
    } catch (err) {
      setSecurityError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <Navbar isFixed={true} forceDark={true} />
      
      <main style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <button 
              onClick={() => navigate(-1)}
              style={{ padding: '0.5rem', borderRadius: '50%', background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: 'pointer' }}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Account <span style={{ color: C.accentLight, fontStyle: 'italic' }}>Settings</span></h1>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            
            {/* SIDE NAV */}
            <aside style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <SideTab icon={User} label="General Info" active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
              <SideTab icon={Shield} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
              <div style={{ height: '1px', background: C.border, margin: '1rem 0' }} />
              <button 
                onClick={() => { logout(); navigate('/'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', borderRadius: '12px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </aside>

            {/* CONTENT AREA */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              
              {activeTab === 'general' ? (
                <>
                  {/* Profile Photo Section */}
                  <section style={{ background: C.surface, borderRadius: '24px', border: `1px solid ${C.border}`, padding: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ 
                          width: '100px', height: '100px', borderRadius: '32px', 
                          background: avatar && avatar.length > 5 ? `url(${avatar}) center/cover` : `linear-gradient(135deg, ${C.accentDark}, ${C.accentLight})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '2.5rem', fontWeight: '800', color: 'white',
                          boxShadow: '0 10px 25px rgba(34,197,94,0.3)',
                          overflow: 'hidden'
                        }}>
                          {(!avatar || avatar.length <= 5) && (user.name[0].toUpperCase())}
                        </div>
                        <button 
                          onClick={() => fileInputRef.current.click()}
                          style={{ 
                            position: 'absolute', bottom: '-5px', right: '-5px', 
                            width: '36px', height: '36px', borderRadius: '12px', 
                            background: C.surfaceLight, border: `2px solid ${C.bg}`, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            color: C.accentLight, cursor: 'pointer' 
                          }}
                        >
                          <Camera size={18} />
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handlePhotoChange} 
                          style={{ display: 'none' }} 
                          accept="image/*"
                        />
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: '700' }}>Your Profile Photo</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: C.muted }}>Upload a new photo from your device.</p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                          <button 
                            onClick={() => fileInputRef.current.click()}
                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: C.surfaceLight, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Change Photo
                          </button>
                          <button 
                            onClick={() => setAvatar(null)}
                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Personal Info Form */}
                  <section style={{ background: C.surface, borderRadius: '24px', border: `1px solid ${C.border}`, padding: '2.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <InputField label="Full Name" value={name} onChange={setName} icon={User} />
                      <InputField label="Email Address" value={email} onChange={setEmail} icon={Mail} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bio</label>
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        style={{ 
                          width: '100%', minHeight: '100px', background: C.bg, border: `1px solid ${C.border}`, 
                          borderRadius: '12px', color: C.text, padding: '1rem', fontSize: '0.95rem', outline: 'none', resize: 'none'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: '2rem' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: C.muted }}>
                        {success && <span style={{ color: C.accentLight, fontWeight: '600' }}>✓ All changes saved successfully</span>}
                        {error && <span style={{ color: '#ef4444', fontWeight: '600' }}>✗ {error}</span>}
                      </p>
                      <button 
                        onClick={handleSave}
                        disabled={loading}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 2rem', 
                          borderRadius: '12px', background: loading ? C.surfaceLight : C.accentDark, 
                          color: 'white', border: 'none', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                        Save Changes
                      </button>
                    </div>
                  </section>
                </>
              ) : (
                /* Security Section */
                <section style={{ background: C.surface, borderRadius: '24px', border: `1px solid ${C.border}`, padding: '2.5rem' }}>
                  <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>Update Password</h3>
                  <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <InputField label="Old Password" type="password" value={oldPassword} onChange={setOldPassword} icon={Shield} />
                    <InputField label="New Password" type="password" value={newPassword} onChange={setNewPassword} icon={Shield} />
                    <InputField label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} icon={Shield} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: '2rem', marginTop: '1rem' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>
                        {securitySuccess && <span style={{ color: C.accentLight, fontWeight: '600' }}>✓ {securitySuccess}</span>}
                        {securityError && <span style={{ color: '#ef4444', fontWeight: '600' }}>✗ {securityError}</span>}
                      </p>
                      <button 
                        type="submit"
                        disabled={loading}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 2rem', 
                          borderRadius: '12px', background: loading ? C.surfaceLight : C.accentDark, 
                          color: 'white', border: 'none', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />} 
                        Update Password
                      </button>
                    </div>
                  </form>
                </section>
              )}

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

function SideTab({ icon: Icon, label, active = false, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '12px',
        background: active ? C.accentBg : 'transparent', color: active ? C.accentLight : C.muted,
        border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
      }}
    >
      <Icon size={20} /> <span style={{ flex: 1 }}>{label}</span>
      {active && <ChevronRight size={16} />}
    </button>
  );
}

function InputField({ label, value, onChange, icon: Icon, type = 'text' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ 
            width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', background: C.bg, border: `1px solid ${C.border}`, 
            borderRadius: '12px', color: C.text, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  );
}
