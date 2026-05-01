import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Globe, BookOpen, CheckCircle2, Loader2, User as UserIcon, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surfaceLight: '#1a1a1a',
  border: 'rgba(255,255,255,0.08)',
  text: '#f5f5f5',
  muted: '#a3a3a3',
  accent: '#22c55e',
  accentLight: '#4ade80',
  accentDark: '#16a34a',
  accentBg: 'rgba(34,197,94,0.1)',
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = async (googleUser) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.user);
        navigate('/');
      } else {
        setError(data.message || 'Google Login failed');
      }
    } catch (err) {
      setError('Could not connect to Google service.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const body = isLogin ? { email, password } : { name, email, password };
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        navigate('/');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection to server failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <Navbar isFixed={true} forceDark={true} />
      
      <div style={{ flex: 1, display: 'flex', paddingTop: '64px' }}>
        
        {/* LEFT SIDE — Quote & Features */}
        <div className="hidden lg:flex" style={{ 
          flex: 1, 
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 100%)', 
          padding: '4rem', 
          flexDirection: 'column', 
          justifyContent: 'center',
          borderRight: `1px solid ${C.border}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Decorative element */}
          <div style={{ 
            position: 'absolute', 
            top: '-10%', 
            left: '-10%', 
            width: '400px', 
            height: '400px', 
            background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              lineHeight: '1.2', 
              marginBottom: '1.5rem',
              fontFamily: 'Georgia, serif'
            }}>
              "A reader lives a thousand lives before he dies. <span style={{ color: C.accentLight }}>The man who never reads lives only one."</span>
            </h2>
            <p style={{ color: C.muted, fontSize: '1rem', marginBottom: '3rem' }}>— George R.R. Martin</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <FeatureItem text="Access thousands of books instantly" />
              <FeatureItem text="Smart notes and highlights" />
              <FeatureItem text="Track your reading progress" />
              <FeatureItem text="Beautiful night reading mode" />
              <FeatureItem text="Never lose your place" />
            </div>
          </div>

          <div style={{ marginTop: 'auto', color: C.muted, fontSize: '0.8rem', opacity: 0.5 }}>
            © 2026 Redify · Privacy Policy · Terms of Service
          </div>
        </div>

        {/* RIGHT SIDE — Login Form */}
        <div style={{ 
          flex: 1, 
          background: '#0a0a0a', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '2rem' 
        }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            
            {/* Toggle */}
            <div style={{ 
              display: 'flex', 
              background: C.surface, 
              padding: '0.4rem', 
              borderRadius: '12px', 
              marginBottom: '2.5rem',
              border: `1px solid ${C.border}`
            }}>
              <button 
                onClick={() => { setIsLogin(true); setError(''); }}
                style={{ 
                  flex: 1, 
                  padding: '0.6rem', 
                  borderRadius: '8px', 
                  border: 'none',
                  background: isLogin ? C.surfaceLight : 'transparent',
                  color: isLogin ? C.text : C.muted,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >Sign In</button>
              <button 
                onClick={() => { setIsLogin(false); setError(''); }}
                style={{ 
                  flex: 1, 
                  padding: '0.6rem', 
                  borderRadius: '8px', 
                  border: 'none',
                  background: !isLogin ? C.surfaceLight : 'transparent',
                  color: !isLogin ? C.text : C.muted,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >Create Account</button>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {isLogin ? 'Welcome back' : 'Join the library'}
            </h1>
            <p style={{ color: C.muted, fontSize: '0.9rem', marginBottom: '2rem' }}>
              {isLogin ? 'Sign in to continue your reading journey.' : 'Start your thousand lives today.'}
            </p>

            {error && (
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.2)', 
                borderRadius: '8px', 
                color: '#ef4444', 
                fontSize: '0.85rem',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {!isLogin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.muted }} size={18} />
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '0.85rem 1rem 0.85rem 3rem', 
                        background: C.surface, 
                        border: `1px solid ${C.border}`, 
                        borderRadius: '12px',
                        color: C.text,
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }} 
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.muted }} size={18} />
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.85rem 1rem 0.85rem 3rem', 
                      background: C.surface, 
                      border: `1px solid ${C.border}`, 
                      borderRadius: '12px',
                      color: C.text,
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                  {isLogin && <a href="#" style={{ fontSize: '0.75rem', color: C.accentLight, textDecoration: 'none' }}>Forgot password?</a>}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.muted }} size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.85rem 1rem 0.85rem 3rem', 
                      background: C.surface, 
                      border: `1px solid ${C.border}`, 
                      borderRadius: '12px',
                      color: C.text,
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }} 
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{ 
                  marginTop: '0.5rem',
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: 'none',
                  background: loading ? C.surfaceLight : C.accentDark,
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(34,197,94,0.3)'
                }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = C.accent)}
                onMouseLeave={e => !loading && (e.currentTarget.style.background = C.accentDark)}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? 'Sign In' : 'Create Account')} {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: C.border }} />
              <span style={{ fontSize: '0.75rem', color: C.muted }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: C.border }} />
            </div>

            <button 
              onClick={() => setShowGoogleModal(true)}
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.85rem', 
                borderRadius: '12px', 
                border: `1px solid ${C.border}`,
                background: C.surface,
                color: C.text,
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'background 0.2s',
                opacity: loading ? 0.7 : 1
              }} 
              onMouseEnter={e => !loading && (e.currentTarget.style.background = C.surfaceLight)} 
              onMouseLeave={e => !loading && (e.currentTarget.style.background = C.surface)}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Globe size={20} />} 
              Continue with Google
            </button>

            <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: C.muted }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: C.accentLight, 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  padding: 0,
                  fontSize: '0.9rem'
                }}
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>

          </div>
        </div>

      </div>

      {/* GOOGLE ACCOUNT MODAL */}
      {showGoogleModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{ 
            background: C.surface, width: '100%', maxWidth: '400px', borderRadius: '24px', 
            border: `1px solid ${C.border}`, padding: '2rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', background: C.surfaceLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
              }}>
                <Globe size={24} color={C.accentLight} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.5rem' }}>Choose an account</h2>
              <p style={{ fontSize: '0.9rem', color: C.muted }}>to continue to <span style={{ color: C.accentLight, fontWeight: '700' }}>Redify</span></p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <GoogleAccountItem 
                name="Shafi Ahmed" 
                email="shafi.ahmed@gmail.com" 
                avatar="S" 
                onClick={() => handleGoogleLogin({ id: 101, name: 'Shafi Ahmed', email: 'shafi.ahmed@gmail.com', avatar: 'S' })} 
              />
              <GoogleAccountItem 
                name="Abdullah Al Masum" 
                email="abdullah.masum@google.com" 
                avatar="A" 
                onClick={() => handleGoogleLogin({ id: 102, name: 'Abdullah Al Masum', email: 'abdullah.masum@google.com', avatar: 'A' })} 
              />
              <button 
                onClick={() => setShowGoogleModal(false)}
                style={{ 
                  marginTop: '1rem', background: 'transparent', border: 'none', color: C.muted, 
                  fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', padding: '0.5rem' 
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GoogleAccountItem({ name, email, avatar, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '16px',
        background: C.surfaceLight, border: `1px solid ${C.border}`, width: '100%',
        cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.accentLight}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
    >
      <div style={{ 
        width: '40px', height: '40px', borderRadius: '10px', 
        background: `linear-gradient(135deg, ${C.accentDark}, ${C.accentLight})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'white'
      }}>
        {avatar}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{name}</p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: C.muted }}>{email}</p>
      </div>
      <ChevronRight size={16} color={C.muted} />
    </button>
  );
}

function FeatureItem({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ 
        width: '24px', 
        height: '24px', 
        borderRadius: '6px', 
        background: C.accentBg, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CheckCircle2 size={16} color={C.accentLight} />
      </div>
      <span style={{ fontSize: '1rem', color: C.text, opacity: 0.9 }}>{text}</span>
    </div>
  );
}
