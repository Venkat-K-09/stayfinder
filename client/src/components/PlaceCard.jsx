import { useState } from 'react'
import { Link } from 'react-router-dom'

const CATEGORY_ICONS = {
  beach: '🏖️', mountain: '🏔️', city: '🏙️',
  countryside: '🌾', cabin: '🪵', other: '🏠',
}

export default function PlaceCard({ place, index = 0 }) {
  const [liked, setLiked] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState(0)

  const { _id, title, location, photos, price, category, maxGuests } = place

  return (
    <div className="fade-up" style={{ animationDelay: `${index * 0.06}s` }}>
      <Link to={`/place/${_id}`} style={{ display: 'block', textDecoration: 'none' }}>
        {/* Image container */}
        <div style={{
          position: 'relative', aspectRatio: '4/3',
          borderRadius: 'var(--radius)', overflow: 'hidden',
          background: 'var(--bg3)', marginBottom: 12,
        }}>
          {/* Skeleton */}
          {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}

          {photos?.length > 0 ? (
            <img
              src={photos[currentPhoto]}
              alt={title}
              onLoad={() => setImgLoaded(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.4s ease, opacity 0.3s ease',
                opacity: imgLoaded ? 1 : 0,
                transform: 'scale(1)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 48,
            }}>
              {CATEGORY_ICONS[category] || '🏠'}
            </div>
          )}

          {/* Photo dots */}
          {photos?.length > 1 && (
            <div style={{
              position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 4,
            }}>
              {photos.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.preventDefault(); setCurrentPhoto(i) }}
                  style={{
                    width: i === currentPhoto ? 16 : 6, height: 6,
                    borderRadius: 3, border: 'none',
                    background: i === currentPhoto ? 'white' : 'rgba(255,255,255,0.55)',
                    transition: 'all 0.25s ease', cursor: 'pointer', padding: 0,
                  }}
                />
              ))}
            </div>
          )}

          {/* Category badge */}
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
            color: 'white', padding: '4px 10px', borderRadius: 50,
            fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {CATEGORY_ICONS[category]} {category}
          </div>

          {/* Wishlist button */}
          <button
            onClick={e => { e.preventDefault(); setLiked(l => !l) }}
            style={{
              position: 'absolute', top: 10, right: 10,
              background: 'none', border: 'none', padding: 6, cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? 'var(--brand)' : 'none'}
              stroke={liked ? 'var(--brand)' : 'white'} strokeWidth="2.5"
              style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '0 2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', lineHeight: 1.3, maxWidth: '65%' }}>
              {title}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', whiteSpace: 'nowrap' }}>
              ₹{price?.toLocaleString()}
              <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--text3)' }}>/night</span>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {location} · Up to {maxGuests} guests
          </div>
        </div>
      </Link>
    </div>
  )
}
