import { useState } from 'react'
import api from '../api'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

export default function BookingWidget({ place }) {
  const { user } = useUser()
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0
  const total = nights * (place?.price || 0)
  const fee = Math.round(total * 0.12)
  const grand = total + fee

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (!checkIn || !checkOut || !name || !phone) { setError('Please fill in all fields'); return }
    if (nights < 1) { setError('Check-out must be after check-in'); return }
    setLoading(true); setError('')
    try {
      await api.post('/bookings', { placeId: place._id, checkIn, checkOut, name, phone, guests })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally { setLoading(false) }
  }

  if (success) return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
      padding: 28, textAlign: 'center', animation: 'fadeIn 0.4s ease',
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
        Booking confirmed!
      </div>
      <div style={{ color: 'var(--text3)', fontSize: 14 }}>Redirecting to your trips...</div>
    </div>
  )

  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
      padding: 24, boxShadow: 'var(--shadow-lg)', position: 'sticky', top: 90,
      background: 'var(--surface)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 26 }}>
          ₹{place?.price?.toLocaleString()}
        </span>
        <span style={{ color: 'var(--text3)', fontSize: 15 }}>/ night</span>
      </div>

      {/* Date grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
        overflow: 'hidden', marginBottom: 12,
      }}>
        {[
          { label: 'CHECK-IN', value: checkIn, onChange: e => setCheckIn(e.target.value), min: new Date().toISOString().split('T')[0] },
          { label: 'CHECK-OUT', value: checkOut, onChange: e => setCheckOut(e.target.value), min: checkIn || new Date().toISOString().split('T')[0], style: { borderLeft: '1px solid var(--border)' } },
        ].map(({ label, value, onChange, min, style = {} }) => (
          <div key={label} style={{ padding: '10px 14px', ...style }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
            <input type="date" value={value} onChange={onChange} min={min}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: 'var(--text)', width: '100%', cursor: 'pointer' }} />
          </div>
        ))}
      </div>

      {/* Guests */}
      <div style={{
        border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
        padding: '10px 14px', marginBottom: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text3)', marginBottom: 2 }}>GUESTS</div>
          <div style={{ fontSize: 14, color: 'var(--text)' }}>{guests} guest{guests > 1 ? 's' : ''}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setGuests(g => Math.max(1, g - 1))} style={{
            width: 28, height: 28, borderRadius: 50, border: '1.5px solid var(--border2)',
            background: 'none', color: 'var(--text)', fontSize: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>−</button>
          <span style={{ fontWeight: 600 }}>{guests}</span>
          <button onClick={() => setGuests(g => Math.min(place?.maxGuests || 10, g + 1))} style={{
            width: 28, height: 28, borderRadius: 50, border: '1.5px solid var(--border2)',
            background: 'none', color: 'var(--text)', fontSize: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>+</button>
        </div>
      </div>

      {nights > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <input className="form-input" placeholder="Your full name" value={name}
            onChange={e => setName(e.target.value)} />
          <input className="form-input" placeholder="Phone number" value={phone}
            onChange={e => setPhone(e.target.value)} />
        </div>
      )}

      {error && <div className="error-msg" style={{ marginBottom: 12 }}>{error}</div>}

      <button className="btn-brand" onClick={handleBook} disabled={loading}
        style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16, borderRadius: 'var(--radius-sm)' }}>
        {loading ? <span className="spinner" /> : nights > 0 ? `Reserve · ₹${grand.toLocaleString()}` : 'Check availability'}
      </button>

      {nights > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: 'var(--text2)', textDecoration: 'underline' }}>₹{place?.price?.toLocaleString()} × {nights} nights</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: 'var(--text2)', textDecoration: 'underline' }}>Service fee</span>
            <span>₹{fee.toLocaleString()}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4,
            display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15 }}>
            <span>Total</span>
            <span>₹{grand.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
