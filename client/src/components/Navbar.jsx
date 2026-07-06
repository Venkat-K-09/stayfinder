import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { user, logout } = useUser()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const menuRef = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/?location=${searchVal}`)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 'var(--nav-h)',
      background: scrolled ? 'var(--surface)' : 'var(--bg)',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      transition: 'all var(--transition)',
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 40px',
        width: '100%', display: 'flex', alignItems: 'center', gap: 16,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C16 2 4 12.5 4 20C4 26.627 9.373 30 16 30C22.627 30 28 26.627 28 20C28 12.5 16 2Z" fill="var(--brand)"/>
            <circle cx="16" cy="20" r="4" fill="white"/>
          </svg>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20, color: 'var(--brand)' }}>
            StayFinder
          </span>
        </Link>

        {/* Search bar - center */}
        <form onSubmit={handleSearch} style={{
          flex: 1, maxWidth: 480, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: 50, padding: '8px 8px 8px 20px',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
          transition: 'box-shadow var(--transition), border-color var(--transition)',
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search destinations..."
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              flex: 1, fontSize: 14, color: 'var(--text)', fontFamily: 'inherit',
            }}
          />
          <button type="submit" style={{
            background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
            border: 'none', borderRadius: 40,
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', cursor: 'pointer', flexShrink: 0,
            transition: 'transform var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* List your place link */}
          {user && (
            <Link to="/host" style={{
              fontSize: 14, fontWeight: 600, color: 'var(--text2)',
              padding: '8px 14px', borderRadius: 50,
              transition: 'background var(--transition), color var(--transition)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; }}
            >
              List your place
            </Link>
          )}

          {/* Dark mode toggle */}
          <button onClick={toggle} style={{
            width: 40, height: 40, borderRadius: 50, border: '1.5px solid var(--border)',
            background: 'var(--surface)', color: 'var(--text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>

          {/* User menu */}
          {user ? (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button onClick={() => setMenuOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 6px 6px 14px',
                border: '1.5px solid var(--border)', borderRadius: 50,
                background: 'var(--surface)', color: 'var(--text)',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
                <div style={{
                  width: 32, height: 32, borderRadius: 50,
                  background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 14, boxShadow: 'var(--shadow-lg)',
                  minWidth: 220, overflow: 'hidden',
                  animation: 'slideDown 0.18s ease',
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{user.email}</div>
                  </div>
                  {[
                    { to: '/', label: '🔍  Explore stays', icon: null },
                    { to: '/dashboard', label: '🗓  My trips', icon: null },
                    { to: '/host', label: '🏠  List a place', icon: null },
                    { to: '/my-listings', label: '📋  My listings', icon: null },
                  ].map(item => (
                    <Link key={item.to} to={item.to} style={{
                      display: 'block', padding: '12px 16px',
                      fontSize: 14, fontWeight: 500,
                      color: 'var(--text)', transition: 'background var(--transition)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <button onClick={handleLogout} style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px',
                      background: 'none', border: 'none', fontSize: 14, fontWeight: 500,
                      color: 'var(--brand)', cursor: 'pointer', transition: 'background var(--transition)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn-outline" style={{ padding: '9px 18px', fontSize: 14 }}>
                Log in
              </Link>
              <Link to="/register" className="btn-brand" style={{ padding: '9px 18px', fontSize: 14 }}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
