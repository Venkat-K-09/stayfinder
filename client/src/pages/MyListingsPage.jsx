import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useUser } from '../context/UserContext'

export default function MyListingsPage() {
  const { user, loading: userLoading } = useUser()
  const navigate = useNavigate()
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userLoading && !user) navigate('/login')
  }, [user, userLoading])

  useEffect(() => {
    if (!user) return
    api.get('/places/owner/myplaces')
      .then(({ data }) => setPlaces(data))
      .finally(() => setLoading(false))
  }, [user])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return
    await api.delete(`/places/${id}`)
    setPlaces(p => p.filter(x => x._id !== id))
  }

  return (
    <div className="page fade-in" style={{ maxWidth: 900, margin: '0 auto', padding: '40px 40px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 28, fontWeight: 800 }}>
            My listings
          </h1>
          <p style={{ color: 'var(--text3)', marginTop: 4 }}>Manage your hosted properties</p>
        </div>
        <Link to="/host" className="btn-brand" style={{ padding: '11px 22px' }}>
          + New listing
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', gap: 20, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <div className="skeleton" style={{ width: 140, height: 100, borderRadius: 'var(--radius)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 20, width: '55%', marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 14, width: '35%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : places.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '64px', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏚️</div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, marginBottom: 10 }}>
            No listings yet
          </h3>
          <p style={{ color: 'var(--text3)', marginBottom: 24 }}>
            List your first property and start earning
          </p>
          <Link to="/host" className="btn-brand" style={{ padding: '12px 28px' }}>
            List your place
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {places.map((place, i) => (
            <div key={place._id} className="fade-up" style={{ animationDelay: `${i * 0.05}s`,
              display: 'flex', gap: 20, alignItems: 'center',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              transition: 'box-shadow var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Image */}
              <div style={{ width: 140, height: 110, flexShrink: 0, background: 'var(--bg3)' }}>
                {place.photos?.[0] ? (
                  <img src={place.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🏠</div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: '4px 0' }}>
                <Link to={`/place/${place._id}`} style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
                  fontSize: 16, color: 'var(--text)', display: 'block', marginBottom: 6,
                }}>
                  {place.title}
                </Link>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {place.location}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'rgba(255,56,92,0.1)', color: 'var(--brand)',
                    padding: '3px 10px', borderRadius: 50, fontSize: 12, fontWeight: 600,
                  }}>
                    ₹{place.price?.toLocaleString()}/night
                  </span>
                  <span style={{
                    background: 'var(--bg2)', color: 'var(--text2)',
                    padding: '3px 10px', borderRadius: 50, fontSize: 12, fontWeight: 600,
                  }}>
                    👥 {place.maxGuests} guests max
                  </span>
                  <span style={{
                    background: 'var(--bg2)', color: 'var(--text2)',
                    padding: '3px 10px', borderRadius: 50, fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                  }}>
                    {place.category}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link to={`/place/${place._id}`} style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--border)', color: 'var(--text)',
                  fontSize: 13, fontWeight: 600, textAlign: 'center',
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  View
                </Link>
                <button onClick={() => handleDelete(place._id)} style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--border)', background: 'none',
                  color: 'var(--text3)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
