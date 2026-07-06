import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useUser } from '../context/UserContext'

function StatusBadge({ status }) {
  const colors = {
    confirmed: { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
    cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
    pending: { bg: 'rgba(234,179,8,0.1)', color: '#ca8a04' },
  }
  const c = colors[status] || colors.pending
  return (
    <span style={{
      background: c.bg, color: c.color,
      padding: '4px 12px', borderRadius: 50,
      fontSize: 12, fontWeight: 700, textTransform: 'capitalize',
    }}>{status}</span>
  )
}

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userLoading && !user) navigate('/login')
  }, [user, userLoading])

  useEffect(() => {
    if (!user) return
    api.get('/bookings')
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false))
  }, [user])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    await api.put(`/bookings/${id}/cancel`)
    setBookings(b => b.map(x => x._id === id ? { ...x, status: 'cancelled' } : x))
  }

  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.checkIn) >= new Date())
  const past = bookings.filter(b => b.status !== 'confirmed' || new Date(b.checkIn) < new Date())

  if (loading) return (
    <div className="page" style={{ maxWidth: 900, margin: '0 auto', padding: '40px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
          <div className="skeleton" style={{ width: 160, height: 110, borderRadius: 'var(--radius)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: '30%' }} />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="page fade-in" style={{ maxWidth: 900, margin: '0 auto', padding: '40px 40px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '24px 28px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 50,
          background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 26, fontWeight: 800,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 24, fontWeight: 800 }}>
            {user?.name}
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginTop: 2 }}>{user?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/" className="btn-outline" style={{ padding: '10px 18px', fontSize: 14 }}>
            🔍 Explore
          </Link>
          <Link to="/host" className="btn-brand" style={{ padding: '10px 18px', fontSize: 14 }}>
            + List a place
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 36 }}>
        {[
          { label: 'Total trips', value: bookings.length, icon: '✈️' },
          { label: 'Upcoming', value: upcoming.length, icon: '🗓️' },
          { label: 'Total spent', value: `₹${bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.price, 0).toLocaleString()}`, icon: '💳' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '20px 24px',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming bookings */}
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
        Upcoming trips
      </h2>

      {upcoming.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '48px', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          marginBottom: 36,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✈️</div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 8 }}>No upcoming trips</h3>
          <p style={{ color: 'var(--text3)', marginBottom: 20 }}>Time to plan your next adventure!</p>
          <Link to="/" className="btn-brand" style={{ padding: '11px 24px' }}>Explore stays</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
          {upcoming.map(booking => (
            <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
          ))}
        </div>
      )}

      {/* Past bookings */}
      {past.length > 0 && (
        <>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
            Past trips
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {past.map(booking => (
              <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} past />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function BookingCard({ booking, onCancel, past }) {
  const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000)
  return (
    <div style={{
      display: 'flex', gap: 20,
      background: past ? 'var(--surface)' : 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      opacity: past ? 0.75 : 1,
      transition: 'all var(--transition)',
    }}>
      {/* Image */}
      <div style={{ width: 160, height: 130, flexShrink: 0, background: 'var(--bg3)' }}>
        {booking.place?.photos?.[0] ? (
          <img src={booking.place.photos[0]} alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🏠</div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
        <Link to={`/place/${booking.place?._id}`} style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--text)',
        }}>
          {booking.place?.title}
        </Link>
        <div style={{ fontSize: 13, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {booking.place?.location}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>🗓</span>
          {new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          {' → '}
          {new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          <span style={{ color: 'var(--text3)' }}>· {nights} night{nights > 1 ? 's' : ''}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>₹{booking.price?.toLocaleString()}</div>
      </div>

      {/* Right */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 10 }}>
        <StatusBadge status={booking.status} />
        {booking.status === 'confirmed' && !past && (
          <button onClick={() => onCancel(booking._id)} style={{
            background: 'none', border: '1px solid var(--border2)',
            borderRadius: 'var(--radius-sm)', padding: '6px 14px',
            fontSize: 13, color: 'var(--text3)', cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text3)' }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
