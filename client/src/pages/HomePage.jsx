import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api'
import PlaceCard from '../components/PlaceCard'
import { useUser } from '../context/UserContext'

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🌍' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'mountain', label: 'Mountain', icon: '🏔️' },
  { id: 'city', label: 'City', icon: '🏙️' },
  { id: 'countryside', label: 'Countryside', icon: '🌾' },
  { id: 'cabin', label: 'Cabin', icon: '🪵' },
]

function SkeletonCard() {
  return (
    <div>
      <div className="skeleton" style={{ aspectRatio: '4/3', borderRadius: 'var(--radius)', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '45%' }} />
    </div>
  )
}

export default function HomePage() {
  const { user } = useUser()
  const [searchParams] = useSearchParams()
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)

  const locationParam = searchParams.get('location') || ''

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 50)
  }, [])

  useEffect(() => {
    fetchPlaces()
  }, [category, locationParam])

  const fetchPlaces = async () => {
    setLoading(true)
    try {
      const params = {}
      if (locationParam) params.location = locationParam
      if (category !== 'all') params.category = category
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice
      const { data } = await api.get('/places', { params })
      setPlaces(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const showHero = !locationParam && category === 'all' && !minPrice && !maxPrice

  return (
    <div className="page">
      {/* Hero */}
      {showHero && !user && (
        <div style={{
          background: 'linear-gradient(135deg, #FF385C 0%, #E31C5F 40%, #bd1e59 100%)',
          padding: '80px 40px 100px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          {[
            { size: 400, top: -100, right: -80, opacity: 0.08 },
            { size: 250, bottom: -60, left: '20%', opacity: 0.06 },
            { size: 180, top: 30, left: '10%', opacity: 0.05 },
          ].map((c, i) => (
            <div key={i} style={{
              position: 'absolute', width: c.size, height: c.size, borderRadius: '50%',
              border: '1.5px solid white', opacity: c.opacity,
              top: c.top, right: c.right, bottom: c.bottom, left: c.left,
              animation: `pulse ${4 + i}s ease-in-out infinite`,
            }} />
          ))}

          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <div className={heroVisible ? 'fade-up' : ''} style={{ opacity: heroVisible ? undefined : 0 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 50, padding: '6px 16px', marginBottom: 24,
                color: 'white', fontSize: 13, fontWeight: 600,
              }}>
                ✨ Find your perfect stay
              </div>
              <h1 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800,
                color: 'white', lineHeight: 1.1, marginBottom: 20,
              }}>
                Discover amazing<br />places to stay
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 36, lineHeight: 1.6 }}>
                Book unique homes, apartments, and experiences<br />hosted by real people around the world.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn-brand" style={{
                  background: 'white', color: 'var(--brand)',
                  padding: '14px 32px', fontSize: 16,
                }}>
                  Get started — it's free
                </Link>
                <a href="#places" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  color: 'white', border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: 50, padding: '14px 28px', fontSize: 16, fontWeight: 600,
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'white'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
                >
                  Browse stays ↓
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="fade-up-3" style={{
              display: 'flex', justifyContent: 'center', gap: 48, marginTop: 56,
              paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.2)',
            }}>
              {[['1M+', 'Listings'], ['150+', 'Countries'], ['50M+', 'Guests']].map(([num, label]) => (
                <div key={label} style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{num}</div>
                  <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logged-in hero */}
      {showHero && user && (
        <div style={{ padding: '40px 40px 24px', maxWidth: 1280, margin: '0 auto' }}>
          <div className="fade-up">
            <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 6 }}>
              Welcome back, {user.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'var(--text3)', fontSize: 16 }}>Discover your next adventure</p>
          </div>
        </div>
      )}

      <div id="places" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px 60px' }}>
        {/* Categories */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 28, overflowX: 'auto',
          paddingBottom: 4, scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', borderRadius: 50, flexShrink: 0,
                border: category === cat.id ? '2px solid var(--text)' : '1.5px solid var(--border)',
                background: category === cat.id ? 'var(--text)' : 'var(--surface)',
                color: category === cat.id ? 'var(--bg)' : 'var(--text2)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}

          {/* Filter button */}
          <button
            onClick={() => setFilterOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', borderRadius: 50, flexShrink: 0, marginLeft: 'auto',
              border: '1.5px solid var(--border2)', background: 'var(--surface)',
              color: 'var(--text)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filters
          </button>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 24, marginBottom: 28,
            animation: 'slideDown 0.2s ease',
            display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end',
          }}>
            <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
              <label className="form-label">Min price (₹/night)</label>
              <input className="form-input" type="number" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
              <label className="form-label">Max price (₹/night)</label>
              <input className="form-input" type="number" placeholder="Any" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>
            <button className="btn-brand" onClick={() => { fetchPlaces(); setFilterOpen(false) }}
              style={{ padding: '12px 24px', borderRadius: 'var(--radius-sm)' }}>
              Apply
            </button>
            <button className="btn-outline" onClick={() => { setMinPrice(''); setMaxPrice(''); setFilterOpen(false); fetchPlaces() }}
              style={{ padding: '12px 24px', borderRadius: 'var(--radius-sm)' }}>
              Clear
            </button>
          </div>
        )}

        {/* Location header */}
        {locationParam && (
          <div style={{ marginBottom: 24 }} className="fade-in">
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 24, fontWeight: 700 }}>
              Stays in "{locationParam}"
            </h2>
            <p style={{ color: 'var(--text3)', marginTop: 4 }}>{places.length} place{places.length !== 1 ? 's' : ''} found</p>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="places-grid">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : places.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🏚️</div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, marginBottom: 8 }}>No places found</h3>
            <p style={{ color: 'var(--text3)', marginBottom: 24 }}>Try different filters or be the first to list here!</p>
            {user && (
              <Link to="/host" className="btn-brand" style={{ padding: '12px 28px', borderRadius: 'var(--radius-sm)' }}>
                List your place
              </Link>
            )}
          </div>
        ) : (
          <div className="places-grid">
            {places.map((place, i) => <PlaceCard key={place._id} place={place} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
