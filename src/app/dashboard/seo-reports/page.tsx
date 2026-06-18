'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, statusColor } from '@/lib/utils'
import TopBar from '@/components/layout/TopBar'
import { BarChart3, Plus, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

const EMPTY_REPORT = {
  title: '', client_id: '', status: 'draft',
  page_title_review: '', meta_description_review: '', heading_structure: '',
  keyword_opportunities: '', local_seo: '', content_gaps: '',
  competitor_notes: '', priority_actions: '',
}

export default function SEOReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_REPORT)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [{ data: r }, { data: c }] = await Promise.all([
      supabase.from('seo_reports').select('*,clients(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('id,name').order('name'),
    ])
    setReports(r ?? [])
    setClients(c ?? [])
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('seo_reports').insert({
      ...form,
      user_id: user!.id,
      client_id: form.client_id || null,
    })
    setForm(EMPTY_REPORT)
    setShowForm(false)
    setSaving(false)
    loadData()
  }

  const FIELDS = [
    { k: 'page_title_review', label: 'Page Title Review' },
    { k: 'meta_description_review', label: 'Meta Description Review' },
    { k: 'heading_structure', label: 'Heading Structure (H1, H2...)' },
    { k: 'keyword_opportunities', label: 'Keyword Opportunities' },
    { k: 'local_seo', label: 'Local SEO Recommendations' },
    { k: 'content_gaps', label: 'Content Gaps' },
    { k: 'competitor_notes', label: 'Competitor Notes' },
    { k: 'priority_actions', label: 'Priority Action Plan' },
  ]

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="SEO Reports" subtitle={`${reports.length} total`} actions={
        <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> New Report
        </button>
      } />
      <div className="p-6 flex-1 space-y-4">
        {showForm && (
          <div className="ci-card max-w-2xl space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>New SEO Report</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Report Title *</label>
                <input className="ci-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Q3 SEO Review" />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Client</label>
                <select className="ci-select" value={form.client_id} onChange={e => set('client_id', e.target.value)}>
                  <option value="">— No client —</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            {FIELDS.map(({ k, label }) => (
              <div key={k}>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                <textarea className="ci-textarea" rows={3} value={(form as any)[k]} onChange={e => set(k, e.target.value)} placeholder={`Enter ${label.toLowerCase()}...`} />
              </div>
            ))}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <select className="ci-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="reviewed">Reviewed</option>
                <option value="sent">Sent</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-gold" onClick={handleSave} disabled={saving || !form.title}>
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Report'}
              </button>
            </div>
          </div>
        )}

        {!reports.length ? (
          <div className="ci-card text-center py-16">
            <BarChart3 size={24} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No SEO reports yet.</p>
          </div>
        ) : reports.map((r: any) => (
          <div key={r.id} className="ci-card">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.title}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {r.clients?.name && `${r.clients.name} · `}{formatDate(r.created_at)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`status-badge ${statusColor(r.status)}`}>{r.status}</span>
                {expanded === r.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </div>

            {expanded === r.id && (
              <div className="mt-4 space-y-4" style={{ borderTop: '1px solid var(--bg-border)', paddingTop: 16 }}>
                {FIELDS.map(({ k, label }) => r[k] && (
                  <div key={k}>
                    <h4 className="text-xs font-semibold mb-1" style={{ color: 'var(--gold)' }}>{label}</h4>
                    <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{r[k]}</p>
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
