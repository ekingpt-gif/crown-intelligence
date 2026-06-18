'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Globe, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { formatDate, statusColor } from '@/lib/utils'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const TABS = ['Overview', 'Website', 'SEO', 'Content', 'Social', 'Ads', 'Assets', 'Tasks', 'Reports']

interface Props {
  client: any
  audits: any[]
  seoReports: any[]
  content: any[]
  socialPosts: any[]
  adCampaigns: any[]
  tasks: any[]
  reports: any[]
}

export default function ClientWorkspace({ client, audits, seoReports, content, socialPosts, adCampaigns, tasks, reports }: Props) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(client)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()

  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setLoading(true)
    await supabase.from('clients').update(form).eq('id', client.id)
    setLoading(false)
    setEditing(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm(`Delete client "${client.name}"? This cannot be undone.`)) return
    await supabase.from('clients').delete().eq('id', client.id)
    router.push('/dashboard/clients')
  }

  const socialLinks = [
    { key: 'instagram', icon: ExternalLink, label: 'Instagram' },
    { key: 'linkedin', icon: ExternalLink, label: 'LinkedIn' },
    { key: 'facebook', icon: ExternalLink, label: 'Facebook' },
    { key: 'twitter', icon: ExternalLink, label: 'X' },
    { key: 'tiktok', icon: ExternalLink, label: 'TikTok' },
    { key: 'youtube', icon: ExternalLink, label: 'YouTube' },
  ]

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--bg-border)', background: 'var(--bg-surface)' }}>
        <Link href="/dashboard/clients" className="flex items-center gap-1.5 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={12} /> Back to Clients
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--gold)' }}>
              {client.name[0]}
            </div>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{client.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                {client.industry && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{client.industry}</span>}
                <span className={`status-badge ${statusColor(client.status)}`}>{client.status}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(!editing)} className="btn-ghost">
              <Pencil size={13} /> {editing ? 'Cancel' : 'Edit'}
            </button>
            <button onClick={handleDelete} className="btn-danger">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mt-4 overflow-x-auto" style={{ borderBottom: '1px solid var(--bg-border)', marginBottom: -1 }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors"
              style={{
                color: activeTab === tab ? 'var(--gold-light, #E8C97A)' : 'var(--text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent',
              }}
            >{tab}</button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'Overview' && (
          <div className="max-w-3xl space-y-6">
            {editing ? (
              <div className="space-y-6">
                <div className="ci-card space-y-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Basic Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { k: 'name', label: 'Name' }, { k: 'industry', label: 'Industry' },
                      { k: 'website_url', label: 'Website' }, { k: 'contact_name', label: 'Contact Name' },
                      { k: 'contact_email', label: 'Email' }, { k: 'phone', label: 'Phone' },
                    ].map(({ k, label }) => (
                      <div key={k}>
                        <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                        <input className="ci-input" value={form[k] ?? ''} onChange={e => set(k, e.target.value)} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Status</label>
                      <select className="ci-select" value={form.status} onChange={e => set('status', e.target.value)}>
                        {['lead','active','paused','archived'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="ci-card space-y-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Social Links</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['instagram','facebook','tiktok','linkedin','youtube','twitter'].map(k => (
                      <div key={k}>
                        <label className="block text-xs mb-1 capitalize" style={{ color: 'var(--text-secondary)' }}>{k}</label>
                        <input className="ci-input" value={form[k] ?? ''} onChange={e => set(k, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ci-card space-y-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Brand & Strategy</h3>
                  {[
                    { k: 'brand_voice', label: 'Brand Voice' },
                    { k: 'target_audience', label: 'Target Audience' },
                    { k: 'services', label: 'Services/Offer' },
                    { k: 'competitors', label: 'Competitors' },
                    { k: 'notes', label: 'Notes' },
                  ].map(({ k, label }) => (
                    <div key={k}>
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                      <textarea className="ci-textarea" value={form[k] ?? ''} onChange={e => set(k, e.target.value)} rows={3} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn-gold" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="ci-card space-y-3">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Details</h3>
                  {[
                    { label: 'Contact', value: client.contact_name },
                    { label: 'Email', value: client.contact_email },
                    { label: 'Phone', value: client.phone },
                    { label: 'Added', value: formatDate(client.created_at) },
                  ].map(({ label, value }) => value && (
                    <div key={label} className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ color: 'var(--text-primary)' }}>{value}</span>
                    </div>
                  ))}
                  {client.website_url && (
                    <a href={client.website_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--gold)' }}>
                      <Globe size={12} /> {client.website_url}
                    </a>
                  )}
                </div>

                <div className="ci-card space-y-3">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Social Presence</h3>
                  {socialLinks.filter(s => client[s.key]).map(({ key, icon: Icon, label }) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <Icon size={13} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{label}:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{client[key]}</span>
                    </div>
                  ))}
                  {!socialLinks.some(s => client[s.key]) && (
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No social links added.</p>
                  )}
                </div>

                {client.brand_voice && (
                  <div className="ci-card">
                    <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--gold-light, #E8C97A)' }}>Brand Voice</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{client.brand_voice}</p>
                  </div>
                )}
                {client.target_audience && (
                  <div className="ci-card">
                    <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--gold-light, #E8C97A)' }}>Target Audience</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{client.target_audience}</p>
                  </div>
                )}
                {client.services && (
                  <div className="ci-card">
                    <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--gold-light, #E8C97A)' }}>Services / Offer</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{client.services}</p>
                  </div>
                )}
                {client.notes && (
                  <div className="ci-card">
                    <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--gold-light, #E8C97A)' }}>Notes</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{client.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Website' && (
          <div className="max-w-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Website Audits</h2>
              <Link href={`/dashboard/website-health?client=${client.id}`} className="btn-gold text-xs px-3 py-1.5">+ New Audit</Link>
            </div>
            {!audits.length ? (
              <div className="ci-card text-center py-10">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No audits yet for this client.</p>
              </div>
            ) : audits.map((a: any) => (
              <div key={a.id} className="ci-card">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.url}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(a.created_at)}</div>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: 'Performance', score: a.performance_score },
                    { label: 'SEO', score: a.seo_score },
                    { label: 'Mobile', score: a.mobile_score },
                    { label: 'Technical', score: a.technical_score },
                    { label: 'Conversion', score: a.conversion_score },
                  ].map(({ label, score }) => (
                    <div key={label} className="text-center p-2 rounded-md" style={{ background: 'var(--bg-elevated)' }}>
                      <div className="text-xl font-bold" style={{ color: score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171' }}>
                        {score ?? '–'}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'SEO' && (
          <div className="max-w-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>SEO Reports</h2>
              <Link href={`/dashboard/seo-reports?client=${client.id}`} className="btn-gold text-xs px-3 py-1.5">+ New Report</Link>
            </div>
            {!seoReports.length ? (
              <div className="ci-card text-center py-10">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No SEO reports yet.</p>
              </div>
            ) : seoReports.map((r: any) => (
              <div key={r.id} className="ci-card">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.title}</h3>
                  <span className={`status-badge ${statusColor(r.status)}`}>{r.status}</span>
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(r.created_at)}</div>
                {r.priority_actions && (
                  <div className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{r.priority_actions.slice(0, 200)}...</div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Content' && (
          <div className="max-w-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Content Items</h2>
              <Link href={`/dashboard/content-studio?client=${client.id}`} className="btn-gold text-xs px-3 py-1.5">+ New Content</Link>
            </div>
            {!content.length ? (
              <div className="ci-card text-center py-10">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No content yet.</p>
              </div>
            ) : content.map((c: any) => (
              <div key={c.id} className="ci-card">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.title}</h3>
                  <span className={`status-badge ${statusColor(c.status)}`}>{c.status}</span>
                </div>
                <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{c.type?.replace(/_/g, ' ')} · {formatDate(c.created_at)}</div>
                {c.body && <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{c.body.slice(0, 300)}...</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Social' && (
          <div className="max-w-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Social Posts</h2>
              <Link href={`/dashboard/social-posts?client=${client.id}`} className="btn-gold text-xs px-3 py-1.5">+ New Post</Link>
            </div>
            {!socialPosts.length ? (
              <div className="ci-card text-center py-10">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No social posts yet.</p>
              </div>
            ) : socialPosts.map((p: any) => (
              <div key={p.id} className="ci-card">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium capitalize" style={{ color: 'var(--gold)' }}>{p.platform}</span>
                  <span className={`status-badge ${statusColor(p.status)}`}>{p.status}</span>
                </div>
                {p.hook && <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{p.hook}</p>}
                {p.caption && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.caption.slice(0, 200)}...</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Ads' && (
          <div className="max-w-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Ad Campaigns</h2>
              <Link href={`/dashboard/ad-campaigns?client=${client.id}`} className="btn-gold text-xs px-3 py-1.5">+ New Campaign</Link>
            </div>
            {!adCampaigns.length ? (
              <div className="ci-card text-center py-10">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No campaigns yet.</p>
              </div>
            ) : adCampaigns.map((a: any) => (
              <div key={a.id} className="ci-card">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.campaign_name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono" style={{ color: 'var(--gold)' }}>{a.platform}</span>
                    <span className={`status-badge ${statusColor(a.status)}`}>{a.status}</span>
                  </div>
                </div>
                {a.objective && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Objective: {a.objective}</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Assets' && (
          <div className="max-w-3xl">
            <div className="ci-card text-center py-10">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Asset management coming soon.</p>
            </div>
          </div>
        )}

        {activeTab === 'Tasks' && (
          <div className="max-w-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Tasks</h2>
              <Link href={`/dashboard/tasks?client=${client.id}`} className="btn-gold text-xs px-3 py-1.5">+ New Task</Link>
            </div>
            {!tasks.length ? (
              <div className="ci-card text-center py-10">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No tasks yet.</p>
              </div>
            ) : tasks.map((t: any) => (
              <div key={t.id} className="ci-card flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t.title}</div>
                  {t.due_date && <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Due {formatDate(t.due_date)}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`status-badge ${statusColor(t.priority)}`}>{t.priority}</span>
                  <span className={`status-badge ${statusColor(t.status)}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Reports' && (
          <div className="max-w-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Client Reports</h2>
              <Link href={`/dashboard/reports?client=${client.id}`} className="btn-gold text-xs px-3 py-1.5">+ New Report</Link>
            </div>
            {!reports.length ? (
              <div className="ci-card text-center py-10">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No reports yet.</p>
              </div>
            ) : reports.map((r: any) => (
              <div key={r.id} className="ci-card flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{formatDate(r.created_at)}</div>
                </div>
                <span className={`status-badge ${statusColor(r.status)}`}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
