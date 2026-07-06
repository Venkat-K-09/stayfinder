import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useUser } from '../context/UserContext'

const PERKS = [
  { id: 'wifi', icon: '📶', label: 'WiFi' },
  { id: 'parking', icon: '🚗', label: 'Parking' },
  { id: 'pool', icon: '🏊', label: 'Pool' },
  { id: 'ac', icon: '❄️', label: 'AC' },
  { id: 'kitchen', icon: '🍳', label: 'Kitchen' },
  { id: 'tv', icon: '📺', label: 'TV' },
  { id: 'gym', icon: '🏋️', label: 'Gym' },
  { id: 'pets', icon: '🐾', label: 'Pets OK' },
]

const CATEGORIES = ['beach', 'mountain', 'city', 'countryside', 'cabin', 'other']

const STEPS = ['Basics', 'Details', 'Perks', 'Photos', 'Pricing']

export default function HostPage() {
  const { user, loading: userLoading } = useUser()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: '', address: '', location: '', description: '',
    extraInfo: '', checkIn: 14, checkOut: 11, maxGuests: 2,
    price: 1000, category: 'city',
  })
  const [perks, setPerks] = useState([])
  const [photos, setPhotos] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userLoading && !user) navigate('/login')
  }, [user, userLoading])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handlePhotos = (e) => {
    const files = [...e.target.files]
    setPhotos(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const togglePerk = (id) => setPerks(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('perks', perks.join(','))
      photos.forEach(p => fd.append('photos', p))
      await api.post('/places', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate('/my-listings')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing. Please try again.')
    } finally { setLoading(false) }
  }

  const canNext = () => {
    if (step === 0) return form.title && form.location && form.address && form.category
    if (step === 1) return form.description
    return true
  }

  const stepContent = [
    // Step 0: Basics
    <div key={0} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="form-group">
        <label className="form-label">Listing title *</label>
        <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)}
          placeholder="e.g. Cozy beachfront apartment in Goa" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">City / Region *</label>
          <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)}
            placeholder="e.g. Goa, India" />
        </div>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Full address *</label>
        <input className="form-input" value={form.address} onChange={e => set('address', e.target.value)}
          placeholder="e.g. 123 Beach Road, Calangute, Goa 403516" />
      </div>
    </div>,

    // Step 1: Details
    <div key={1} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea className="form-input" value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Describe your space — the layout, the vibe, what makes it special, what's nearby..." rows={6} />
      </div>
      <div className="form-group">
        <label className="form-label">House rules & extra info</label>
        <textarea className="form-input" value={form.extraInfo} onChange={e => set('extraInfo', e.target.value)}
          placeholder="Any rules, things to note, or helpful tips for guests..." rows={3} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Check-in (hour)</label>
          <input className="form-input" type="number" value={form.checkIn} onChange={e => set('checkIn', e.target.value)} min={0} max={23} />
        </div>
        <div className="form-group">
          <label className="form-label">Check-out (hour)</label>
          <input className="form-input" type="number" value={form.checkOut} onChange={e => set('checkOut', e.target.value)} min={0} max={23} />
        </div>
        <div className="form-group">
          <label className="form-label">Max guests</label>
          <input className="form-input" type="number" value={form.maxGuests} onChange={e => set('maxGuests', e.target.value)} min={1} />
        </div>
      </div>
    </div>,

    // Step 2: Perks
    <div key={2}>
      <p style={{ color: 'var(--text3)', marginBottom: 20 }}>Select all the amenities your place offers:</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {PERKS.map(perk => (
          <button key={perk.id} type="button" onClick={() => togglePerk(perk.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            padding: '18px 12px', borderRadius: 'var(--radius)',
            border: perks.includes(perk.id) ? '2px solid var(--text)' : '1.5px solid var(--border)',
            background: perks.includes(perk.id) ? 'var(--bg2)' : 'var(--surface)',
            cursor: 'pointer', transition: 'all var(--transition)',
            transform: perks.includes(perk.id) ? 'scale(1.02)' : 'scale(1)',
          }}>
            <span style={{ fontSize: 26 }}>{perk.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{perk.label}</span>
            {perks.includes(perk.id) && <span style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 700 }}>✓ Added</span>}
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Photos
    <div key={3}>
      <div style={{
        border: '2px dashed var(--border2)', borderRadius: 'var(--radius-lg)',
        padding: 40, textAlign: 'center', marginBottom: 20, cursor: 'pointer',
        transition: 'border-color var(--transition)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
      onClick={() => document.getElementById('photo-input').click()}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>📸</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          Upload photos
        </div>
        <div style={{ color: 'var(--text3)', fontSize: 14 }}>Click to browse, or drag & drop</div>
        <input id="photo-input" type="file" multiple accept="image/*" onChange={handlePhotos} style={{ display: 'none' }} />
      </div>

      {previews.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
          {previews.map((src, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {i === 0 && (
                <div style={{
                  position: 'absolute', bottom: 6, left: 6,
                  background: 'rgba(0,0,0,0.6)', color: 'white',
                  fontSize: 11, padding: '2px 8px', borderRadius: 50, fontWeight: 600,
                }}>Cover</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>,

    // Step 4: Pricing
    <div key={4} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <label className="form-label" style={{ fontSize: 15, marginBottom: 10, display: 'block' }}>
          Price per night (₹)
        </label>
        <div style={{ position: 'relative', maxWidth: 240 }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontSize: 20, fontWeight: 600 }}>₹</span>
          <input className="form-input" type="number" value={form.price} onChange={e => set('price', e.target.value)}
            min={100} style={{ paddingLeft: 36, fontSize: 24, fontWeight: 700, maxWidth: 240 }} />
        </div>
      </div>

      {/* Summary */}
      <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius)', padding: 24 }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, marginBottom: 16 }}>Listing summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
          {[
            ['Title', form.title],
            ['Location', `${form.address}, ${form.location}`],
            ['Category', form.category],
            ['Guests', `Up to ${form.maxGuests}`],
            ['Check-in / out', `${form.checkIn}:00 / ${form.checkOut}:00`],
            ['Perks', perks.length > 0 ? perks.join(', ') : 'None selected'],
            ['Photos', `${photos.length} photo${photos.length !== 1 ? 's' : ''}`],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: 'var(--text3)', minWidth: 120 }}>{label}</span>
              <span style={{ fontWeight: 500, color: 'var(--text)' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}
    </div>,
  ]

  return (
    <div className="page" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 40px 80px' }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          List your place
        </h1>
        <p style={{ color: 'var(--text3)' }}>Share your space and start earning</p>
      </div>

      {/* Progress steps */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 50,
                background: i < step ? 'var(--brand)' : i === step ? 'var(--text)' : 'var(--bg3)',
                color: i <= step ? 'white' : 'var(--text3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                transition: 'all var(--transition)',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: i === step ? 'var(--text)' : 'var(--text3)', whiteSpace: 'nowrap' }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: '0 8px', marginBottom: 20,
                background: i < step ? 'var(--brand)' : 'var(--bg3)',
                transition: 'background var(--transition)',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="fade-in" key={step} style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 32, marginBottom: 24,
      }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
          {STEPS[step]}
        </h2>
        {stepContent[step]}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-outline" onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/')}
          style={{ padding: '12px 24px' }}>
          {step === 0 ? 'Cancel' : '← Back'}
        </button>

        {step < STEPS.length - 1 ? (
          <button className="btn-brand" onClick={() => setStep(s => s + 1)}
            disabled={!canNext()} style={{ padding: '12px 28px' }}>
            Next →
          </button>
        ) : (
          <button className="btn-brand" onClick={handleSubmit} disabled={loading}
            style={{ padding: '12px 28px' }}>
            {loading ? <span className="spinner" /> : '🏠 Publish listing'}
          </button>
        )}
      </div>
    </div>
  )
}
