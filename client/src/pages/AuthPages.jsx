import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="page" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: '80px 20px 40px',
      background: 'var(--bg)',
    }}>
      <div className="fade-up" style={{
        width: '100%', maxWidth: 440,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px 40px 36px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <path d="M16 3C16 3 5 12.5 5 20C5 26.075 9.925 30 16 30C22.075 30 27 26.075 27 20C27 12.5 16 3Z" fill="white"/>
              <circle cx="16" cy="20" r="4" fill="rgba(255,56,92,0.4)"/>
            </svg>
          </div>
        </div>

        <h1 style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: 26, fontWeight: 800, textAlign: 'center', marginBottom: 6,
        }}>{title}</h1>
        <p style={{ color: 'var(--text3)', textAlign: 'center', fontSize: 15, marginBottom: 32 }}>{subtitle}</p>

        {children}

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text3)', marginTop: 24 }}>
          {footer}
        </p>
      </div>
    </div>
  )
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const { login } = useUser()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your StayFinder account"
      footer={<>Don't have an account? <Link to="/register" style={{ color: 'var(--brand)', fontWeight: 600 }}>Sign up</Link></>}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input className="form-input" type={showPw ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Your password"
              required style={{ width: '100%', paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPw(s => !s)} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 0,
            }}>
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button type="submit" className="btn-brand" disabled={loading}
          style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 4, borderRadius: 'var(--radius-sm)', fontSize: 16 }}>
          {loading ? <span className="spinner" /> : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  )
}

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const { register } = useUser()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthColors = ['', '#ef4444', '#f97316', '#22c55e']
  const strengthLabels = ['', 'Too short', 'Fair', 'Strong']

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join millions of travellers on StayFinder"
      footer={<>Already have an account? <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>Log in</Link></>}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Full name</label>
          <input className="form-input" value={name}
            onChange={e => setName(e.target.value)} placeholder="John Doe" required />
        </div>

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input className="form-input" type={showPw ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
              required style={{ width: '100%', paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPw(s => !s)} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 0,
            }}>
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
          {password.length > 0 && (
            <div style={{ marginTop: 6 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: i <= strength ? strengthColors[strength] : 'var(--bg3)',
                    transition: 'background 0.3s ease',
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: strengthColors[strength], fontWeight: 600 }}>
                {strengthLabels[strength]}
              </div>
            </div>
          )}
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button type="submit" className="btn-brand" disabled={loading}
          style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 4, borderRadius: 'var(--radius-sm)', fontSize: 16 }}>
          {loading ? <span className="spinner" /> : 'Create account'}
        </button>

        <p style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.6 }}>
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  )
}
