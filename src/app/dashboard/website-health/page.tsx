'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateAuditScores } from '@/lib/mock-ai'
import { formatDate } from '@/lib/utils'
import TopBar from '@/components/layout/TopBar'
import { Globe, Loader2, Plus } from 'lucide-react'

export default function WebsiteHealthPage() {
  const [audits, setAudits] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [url, setUrl] = useState('')
  const [clientId, setClientId] = useState('')
  const [running, setRunning] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [{ data: a }, { data: c }] = await Promise.all([
      supabase.from('website_audits').select('*,clients(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('id,name').order('name'),
    ])
    setAudits(a ?? [])
    setClients(c ?? [])
  }

  const runAudit = async () => {
    if (!url) return
    setRunning(true)
    const { data: { user } } = await supabase.auth.getUser()
    const scores = await generateAuditScores(url)
    await supabase.from('website_audits').insert({
      user_id: user!.id,
      client_id: clientId || null,
      url,
      performance_score: scores.performance,
      seo_score: scores.seo,
      mobile_score: scores.mobile,
      technical_score: scores.technical,
      conversion_score: scores.conversion,
      performance_notes: scores.notes.performance,
      seo_notes: scores.notes.seo,
      mobile_notes: scores.notes.mobile,
      technical_notes: scores.notes.technical,
      conversion_notes: scores.notes.conversion,
      suggested_fixes: 'See category notes above.',
    })
    setUrl('')
    setClientId('')
    setShowForm(false)
    setRunning(false)
    loadData()
  }

  const ScoreBar = ({ label, score, notes }: { label: string; score: number; notes: string }) => {
    const color = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171'
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
          <span className="text-sm font-bold" style={{ color }}>{score}</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
        </div>
        {notes && <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>{notes}</p>}
      </div>
    )
  }

  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Website Health"
        subtitle="Audit & monitor client websites"
        actions={
          <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
            <Plus size={14} /> New Audit
          </button>
        }
      />
      <div className="p-6 flex-1 space-y-6">
        {/* New Audit Form */}
        {showForm && (
          <div className="ci-card max-w-xl space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Run New Audit</h2>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Website URL *</label>
              <input className="ci-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Link to Client (optional)</label>
              <select className="ci-select" value={clientId} onChange={e => setClientId(e.target.value)}>
                <option value="">— No client —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-gold" onClick={runAudit} disabled={running || !url}>
                {running ? <><Loader2 size={14} className="animate-spin" /> Running audit...</> : <><Globe size={14} /> Run Audit</>}
              </button>
            </div>
            {running && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Analysing website... (mock data — connect Google PageSpeed API for real scores)
              </p>
            )}
          </div>
        )}

        {/* Audit List */}
        {!audits.length ? (
          <div className="ci-card text-center py-16">
            <Globe size={24} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No audits yet. Run your first website audit above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {audits.map((a: any) => (
              <div key={a.id} className="ci-card">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.url}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {a.clients?.name && `${a.clients.name} · `}{formatDate(a.created_at)}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {[
                      { label: 'Perf', score: a.performance_score },
                      { label: 'SEO', score: a.seo_score },
                      { label: 'Mobile', score: a.mobile_score },
                    ].map(({ label, score }) => (
                      <div key={label} className="text-center">
                        <div className="text-sm font-bold" style={{ color: score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171' }}>{score}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {expanded === a.id && (
                  <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: 16 }}>
                    <ScoreBar label="Performance" score={a.performance_score} notes={a.performance_notes} />
                    <ScoreBar label="SEO Basics" score={a.seo_score} notes={a.seo_notes} />
                    <ScoreBar label="Mobile Friendliness" score={a.mobile_score} notes={a.mobile_notes} />
                    <ScoreBar label="Technical Issues" score={a.technical_score} notes={a.technical_notes} />
                    <ScoreBar label="Conversion Optimisation" score={a.conversion_score} notes={a.conversion_notes} />
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
