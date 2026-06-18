'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateContent } from '@/lib/mock-ai'
import { formatDate, statusColor } from '@/lib/utils'
import TopBar from '@/components/layout/TopBar'
import { PenSquare, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

const CONTENT_TYPES = [
  { value: 'blog_idea', label: 'Blog Ideas' },
  { value: 'blog_article', label: 'Full Blog Article' },
  { value: 'website_copy', label: 'Website Copy' },
  { value: 'email_campaign', label: 'Email Campaign' },
  { value: 'landing_page', label: 'Landing Page Copy' },
  { value: 'offer_positioning', label: 'Offer Positioning' },
]

export default function ContentStudioPage() {
  const [items, setItems] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState('')
  const [form, setForm] = useState({ client_id: '', type: 'blog_idea', title: '', context: '' })
  const [generated, setGenerated] = useState('')
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [{ data: i }, { data: c }] = await Promise.all([
      supabase.from('content_items').select('*,clients(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('id,name,brand_voice,target_audience,services').order('name'),
    ])
    setItems(i ?? [])
    setClients(c ?? [])
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleGenerate = async () => {
    const client = clients.find(c => c.id === form.client_id)
    const clientName = client?.name ?? 'the client'
    const context = `Brand voice: ${client?.brand_voice ?? 'professional'}. Audience: ${client?.target_audience ?? 'general'}. Services: ${client?.services ?? 'marketing'}. ${form.context}`
    setGenerating(true)
    const result = await generateContent(form.type, clientName, context)
    setGenerated(result)
    setGenerating(false)
  }

  const handleSave = async () => {
    if (!form.title || !generated) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('content_items').insert({
      user_id: user!.id,
      client_id: form.client_id || null,
      type: form.type,
      title: form.title,
      body: generated,
      status: 'draft',
    })
    setForm({ client_id: '', type: 'blog_idea', title: '', context: '' })
    setGenerated('')
    setShowForm(false)
    setSaving(false)
    loadData()
  }

  const handleUpdateBody = async (id: string) => {
    await supabase.from('content_items').update({ body: editBody }).eq('id', id)
    setEditingId(null)
    loadData()
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Content Studio" subtitle="Generate & manage AI content" actions={
        <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
          <Sparkles size={14} /> Generate Content
        </button>
      } />
      <div className="p-6 flex-1 space-y-4">
        {showForm && (
          <div className="ci-card max-w-2xl space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Generate New Content</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Content Type</label>
                <select className="ci-select" value={form.type} onChange={e => set('type', e.target.value)}>
                  {CONTENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Client</label>
                <select className="ci-select" value={form.client_id} onChange={e => set('client_id', e.target.value)}>
                  <option value="">— No client —</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title / Filename</label>
              <input className="ci-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Q3 Blog Ideas for Acme Corp" />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Additional Context (optional)</label>
              <textarea className="ci-textarea" rows={2} value={form.context} onChange={e => set('context', e.target.value)} placeholder="Any specific topics, keywords, or angle to focus on..." />
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost" onClick={() => { setShowForm(false); setGenerated('') }}>Cancel</button>
              <button className="btn-gold" onClick={handleGenerate} disabled={generating}>
                {generating ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><Sparkles size={14} /> Generate</>}
              </button>
            </div>

            {generated && (
              <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: 16 }}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Generated Content (editable)</label>
                  <button className="btn-gold text-xs px-3 py-1.5" onClick={handleSave} disabled={saving || !form.title}>
                    {saving ? 'Saving...' : 'Save to Library'}
                  </button>
                </div>
                <textarea
                  className="ci-textarea"
                  rows={16}
                  value={generated}
                  onChange={e => setGenerated(e.target.value)}
                />
                {!form.title && <p className="text-xs mt-1" style={{ color: '#fbbf24' }}>Add a title above before saving.</p>}
              </div>
            )}
          </div>
        )}

        {!items.length && !showForm ? (
          <div className="ci-card text-center py-16">
            <PenSquare size={24} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No content yet. Generate your first piece above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item.id} className="ci-card">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => {
                  setExpanded(expanded === item.id ? null : item.id)
                  setEditingId(null)
                }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {item.type?.replace(/_/g, ' ')} {item.clients?.name && `· ${item.clients.name}`} · {formatDate(item.created_at)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`status-badge ${statusColor(item.status)}`}>{item.status}</span>
                    {expanded === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>

                {expanded === item.id && (
                  <div className="mt-4" style={{ borderTop: '1px solid var(--bg-border)', paddingTop: 16 }}>
                    {editingId === item.id ? (
                      <div className="space-y-3">
                        <textarea className="ci-textarea" rows={20} value={editBody} onChange={e => setEditBody(e.target.value)} />
                        <div className="flex gap-2">
                          <button className="btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                          <button className="btn-gold" onClick={() => handleUpdateBody(item.id)}>Save Changes</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-end mb-2">
                          <button className="btn-ghost text-xs" onClick={() => { setEditingId(item.id); setEditBody(item.body ?? '') }}>Edit</button>
                        </div>
                        <pre className="text-sm whitespace-pre-wrap font-sans" style={{ color: 'var(--text-secondary)' }}>{item.body}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
