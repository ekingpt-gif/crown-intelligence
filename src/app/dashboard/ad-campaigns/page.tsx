'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, statusColor } from '@/lib/utils'
import TopBar from '@/components/layout/TopBar'
import { Megaphone, Plus, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

const EMPTY = {
  client_id: '', platform: 'meta', campaign_name: '', objective: '',
  offer: '', audience: '', angle: '', primary_text: '', headline: '',
  cta: '', budget: '', notes: '', status: 'planning',
}

export default function AdCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [{ data: a }, { data: c }] = await Promise.all([
      supabase.from('ad_campaigns').select('*,clients(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('id,name').order('name'),
    ])
    setCampaigns(a ?? [])
    setClients(c ?? [])
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.campaign_name) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('ad_campaigns').insert({ ...form, user_id: user!.id, client_id: form.client_id || null })
    setForm(EMPTY)
    setShowForm(false)
    setSaving(false)
    loadData()
  }

  const DETAIL_FIELDS = [
    { k: 'objective', label: 'Objective' },
    { k: 'offer', label: 'Offer' },
    { k: 'audience', label: 'Target Audience' },
    { k: 'angle', label: 'Creative Angle' },
    { k: 'primary_text', label: 'Primary Text' },
    { k: 'headline', label: 'Headline' },
    { k: 'cta', label: 'CTA' },
    { k: 'budget', label: 'Budget' },
    { k: 'notes', label: 'Notes' },
  ]

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Ad Campaigns" subtitle={`${campaigns.length} total`} actions={
        <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> New Campaign
        </button>
      } />
      <div className="p-6 flex-1 space-y-4">
        {showForm && (
          <div className="ci-card max-w-2xl space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>New Ad Campaign</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Campaign Name *</label>
                <input className="ci-input" value={form.campaign_name} onChange={e => set('campaign_name', e.target.value)} placeholder="e.g. Summer Lead Gen" />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Platform</label>
                <select className="ci-select" value={form.platform} onChange={e => set('platform', e.target.value)}>
                  <option value="meta">Meta Ads (Facebook/Instagram)</option>
                  <option value="google">Google Ads</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Client</label>
                <select className="ci-select" value={form.client_id} onChange={e => set('client_id', e.target.value)}>
                  <option value="">— No client —</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
                <select className="ci-select" value={form.status} onChange={e => set('status', e.target.value)}>
                  {['planning','active','paused','completed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {DETAIL_FIELDS.map(({ k, label }) => (
              <div key={k}>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                {['primary_text', 'notes'].includes(k) ? (
                  <textarea className="ci-textarea" rows={3} value={(form as any)[k]} onChange={e => set(k, e.target.value)} />
                ) : (
                  <input className="ci-input" value={(form as any)[k]} onChange={e => set(k, e.target.value)} />
                )}
              </div>
            ))}
            <div className="flex gap-3">
              <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-gold" onClick={handleSave} disabled={saving || !form.campaign_name}>
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Campaign'}
              </button>
            </div>
          </div>
        )}

        {!campaigns.length ? (
          <div className="ci-card text-center py-16">
            <Megaphone size={24} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No campaigns yet.</p>
          </div>
        ) : campaigns.map((a: any) => (
          <div key={a.id} className="ci-card">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--gold)' }}>{a.platform}</span>
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.campaign_name}</h3>
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {a.clients?.name && `${a.clients.name} · `}{formatDate(a.created_at)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`status-badge ${statusColor(a.status)}`}>{a.status}</span>
                {expanded === a.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </div>

            {expanded === a.id && (
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3" style={{ borderTop: '1px solid var(--bg-border)', paddingTop: 16 }}>
                {DETAIL_FIELDS.map(({ k, label }) => a[k] && (
                  <div key={k} className={['primary_text', 'notes'].includes(k) ? 'col-span-2' : ''}>
                    <div className="text-xs font-semibold mb-1" style={{ color: 'var(--gold)' }}>{label}</div>
                    <div className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{a[k]}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
