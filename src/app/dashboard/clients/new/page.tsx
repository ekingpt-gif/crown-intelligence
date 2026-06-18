'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/layout/TopBar'
import Link from 'next/link'

const SOCIAL_FIELDS = ['instagram', 'facebook', 'tiktok', 'linkedin', 'youtube', 'twitter']

export default function NewClientPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', website_url: '', industry: '', contact_name: '', contact_email: '',
    phone: '', notes: '', brand_voice: '', target_audience: '', services: '',
    competitors: '', status: 'lead',
    instagram: '', facebook: '', tiktok: '', linkedin: '', youtube: '', twitter: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('clients').insert({ ...form, user_id: user!.id }).select().single()
    if (!error && data) {
      router.push(`/dashboard/clients/${data.id}`)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Add New Client" actions={
        <Link href="/dashboard/clients" className="btn-ghost">Cancel</Link>
      } />
      <div className="p-6 max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="ci-card space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Client Name *</label>
                <input className="ci-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
                <select className="ci-select" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Website URL</label>
                <input className="ci-input" value={form.website_url} onChange={e => set('website_url', e.target.value)} placeholder="https://example.com" />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Industry</label>
                <input className="ci-input" value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="e.g. Real Estate" />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="ci-card space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Contact Name</label>
                <input className="ci-input" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} placeholder="Jane Smith" />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input className="ci-input" type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone</label>
                <input className="ci-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+61 400 000 000" />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="ci-card space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOCIAL_FIELDS.map(field => (
                <div key={field}>
                  <label className="block text-xs mb-1.5 capitalize" style={{ color: 'var(--text-secondary)' }}>{field === 'twitter' ? 'X (Twitter)' : field}</label>
                  <input className="ci-input" value={(form as any)[field]} onChange={e => set(field, e.target.value)} placeholder={`@handle or URL`} />
                </div>
              ))}
            </div>
          </div>

          {/* Strategy */}
          <div className="ci-card space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Strategy & Brand</h2>
            {[
              { key: 'brand_voice', label: 'Brand Voice', placeholder: 'e.g. Professional, trustworthy, approachable...' },
              { key: 'target_audience', label: 'Target Audience', placeholder: 'e.g. Small business owners aged 30-55...' },
              { key: 'services', label: 'Offer / Services', placeholder: 'e.g. Digital marketing, SEO, paid ads...' },
              { key: 'competitors', label: 'Competitors', placeholder: 'e.g. Competitor A, Competitor B...' },
              { key: 'notes', label: 'Notes', placeholder: 'Any additional notes...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                <textarea className="ci-textarea" value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} rows={3} />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/dashboard/clients" className="btn-ghost">Cancel</Link>
            <button type="submit" className="btn-gold" disabled={loading}>
              {loading ? 'Saving...' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
