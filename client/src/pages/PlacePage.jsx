import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api'
import BookingWidget from '../components/BookingWidget'

const PERKS_MAP = {
  wifi: { icon: '📶', label: 'WiFi' },
  parking: { icon: '🚗', label: 'Free parking' },
  pool: { icon: '🏊', label: 'Swimming pool' },
  ac: { icon: '❄️', label: 'Air conditioning' },
  kitchen: { icon: '🍳', label: 'Kitchen' },
  tv: { icon: '📺', label: 'TV' },
  gym: { icon: '🏋️', label: 'Gym' },
  pets: { icon: '🐾', label: 'Pets allowed' },
}

export default function PlacePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)

  useEffect(() => {
    api.get(`/places/${id}`)
      .then(({ data }) => setPlace(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="page" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px' }}>
      <div className="skeleton" style={{ height: 480, borderRadius: 'var(--radius-lg)', marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 20, width: '40%' }} />
    </div>
  )

  if (!place) return null

  return (
    <div className="page fade-in" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px 60px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 14, color: 'var(--text3)' }}>
        <Link to="/" style={{ color: 'var(--text3)', transition: 'color var(--transition)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
          Home
        </Link>
        <span>›</span>
        <span style={{ color: 'var(--text)' }}>{place.title}</span>
      </div>

      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 30, fontWeight: 800, marginBottom: 10 }}>
        {place.title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'var(--text2)' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {place.address}, {place.location}
        </div>
        <span className="badge badge-gray">👥 Up to {place.maxGuests} guests</span>
        <span className="badge badge-red">🏠 {place.category}</span>
      </div>

      {/* Photo Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '240px 240px', gap: 8, borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 40 }}>
        {place.photos?.length > 0 ? (
          <>
            <div style={{ gridRow: '1 / 3', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setGalleryOpen(true)}>
              <img src={place.photos[0]} alt={place.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', background: 'var(--bg3)' }}
                onClick={() => { setActivePhoto(i); setGalleryOpen(true) }}>
                {place.photos[i] ? (
                  <img src={place.photos[i]} alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'var(--text3)' }}>🏠</div>
                )}
                {i === 4 && place.photos.length > 5 && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 18,
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}>
                    +{place.photos.length - 5} more
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div style={{
            gridColumn: '1 / -1', gridRow: '1 / 3', background: 'var(--bg3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64,
          }}>🏠</div>
        )}
      </div>

      {/* Lightbox */}
      {galleryOpen && place.photos?.length > 0 && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }} onClick={() => setGalleryOpen(false)}>
          <button onClick={() => setGalleryOpen(false)} style={{
            position: 'absolute', top: 20, right: 24,
            background: 'none', border: 'none', color: 'white', fontSize: 28, cursor: 'pointer',
          }}>✕</button>
          <button onClick={e => { e.stopPropagation(); setActivePhoto(p => (p - 1 + place.photos.length) % place.photos.length) }} style={{
            position: 'absolute', left: 20, background: 'rgba(255,255,255,0.15)', border: 'none',
            color: 'white', fontSize: 24, width: 48, height: 48, borderRadius: 50, cursor: 'pointer',
          }}>‹</button>
          <img src={place.photos[activePhoto]} alt="" onClick={e => e.stopPropagation()}
            style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 'var(--radius)' }} />
          <button onClick={e => { e.stopPropagation(); setActivePhoto(p => (p + 1) % place.photos.length) }} style={{
            position: 'absolute', right: 20, background: 'rgba(255,255,255,0.15)', border: 'none',
            color: 'white', fontSize: 24, width: 48, height: 48, borderRadius: 50, cursor: 'pointer',
          }}>›</button>
          <div style={{ position: 'absolute', bottom: 20, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            {activePhoto + 1} / {place.photos.length}
          </div>
        </div>
      )}

      {/* Content + Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 60, alignItems: 'start' }}>
        <div>
          {/* Host info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 24, borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 50,
              background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 22, fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}>
              {place.owner?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                Hosted by {place.owner?.name}
              </div>
              <div style={{ color: 'var(--text3)', fontSize: 14, marginTop: 2 }}>Superhost · Joined 2024</div>
            </div>
          </div>

          {/* Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--border)' }}>
            {[
              { icon: '🏅', title: 'Superhost', desc: 'Superhosts are experienced, highly rated hosts.' },
              { icon: '📍', title: 'Great location', desc: '95% of guests gave location a 5-star rating.' },
              { icon: '🗝️', title: 'Self check-in', desc: `Check in between ${place.checkIn}:00 and ${place.checkOut}:00` },
            ].map(h => (
              <div key={h.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24 }}>{h.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{h.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--text3)', lineHeight: 1.5 }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>About this place</h3>
          <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: 15, marginBottom: 32 }}>{place.description}</p>

          {/* Perks */}
          {place.perks?.length > 0 && (
            <>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
                What this place offers
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 32 }}>
                {place.perks.map(perk => (
                  <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15 }}>
                    <span style={{ fontSize: 20 }}>{PERKS_MAP[perk]?.icon || '✅'}</span>
                    <span style={{ color: 'var(--text2)' }}>{PERKS_MAP[perk]?.label || perk}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Extra info */}
          {place.extraInfo && (
            <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                House rules & notes
              </h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>{place.extraInfo}</p>
            </div>
          )}
        </div>

        {/* Booking widget */}
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
    </div>
  )
}
