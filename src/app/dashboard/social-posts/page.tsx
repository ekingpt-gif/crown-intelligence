'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateSocialPost } from '@/lib/mock-ai'
import { formatDate, statusColor } from '@/lib/utils'
import TopBar from '@/components/layout/TopBar'
import { Share2, Sparkles, Loader2, Plus } from 'lucide-react'

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram Caption' },
  { value: 'linkedin', label: 'LinkedIn Post' },
  { value: 'facebook', label: 'Facebook Post' },
  { value: 'tiktok', label: 'TikTok Script' },
  { value: 'reel', label: 'Reel Idea' },
  { value: 'carousel', label: 'Carousel Outline' },
]

const EMPTY = { client_id: '', platform: 'instagram', context: '', status: 'idea' }

export default function SocialPostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [generated, setGenerated] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('social_posts').select('*,clients(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('id,name').order('name'),
    ])
    setPosts(p ?? [])
    setClients(c ?? [])
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleGenerate = async () => {
    const client = clients.find(c => c.id === form.client_id)
    setGenerating(true)
    const result = await generateSocialPost(form.platform, client?.name ?? 'the client', form.context)
    setGenerated(result)
    setGenerating(false)
  }

  const handleSave = async () => {
    if (!generated) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('social_posts').insert({
      user_id: user!.id,
      client_id: form.client_id || null,
      platform: form.platform,
      caption: generated.caption,
      hook: generated.hook,
      cta: generated.cta,
      hashtags: generated.hashtags,
      status: form.status,
    })
    setForm(EMPTY)
    setGenerated(null)
    setShowForm(false)
    setSaving(false)
    loadData()
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('social_posts').update({ status }).eq('id', id)
    loadData()
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Social Posts" subtitle={`${posts.length} total`} actions={
        <button className="btn-gold" onClick={() => { setShowForm(!showForm); setGenerated(null) }}>
          <Plus size={14} /> New Post
        </button>
      } />
      <div className="p-6 flex-1 space-y-4">
        {showForm && (
          <div className="ci-card max-w-2xl space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Create Social Post</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Platform</label>
                <select className="ci-select" value={form.platform} onChange={e => set('platform', e.target.value)}>
                  {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
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
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Context / Topic</label>
              <textarea className="ci-textarea" rows={2} value={form.context} onChange={e => set('context', e.target.value)} placeholder="What's this post about? Any specific message or offer?" />
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost" onClick={() => { setShowForm(false); setGenerated(null) }}>Cancel</button>
              <button className="btn-gold" onClick={handleGenerate} disabled={generating}>
                {generating ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><Sparkles size={14} /> Generate</>}
              </button>
            </div>

            {generated && (
              <div className="space-y-3" style={{ borderTop: '1px solid var(--bg-border)', paddingTop: 16 }}>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Hook</label>
                  <textarea className="ci-textarea" rows={2} value={generated.hook} onChange={e => setGenerated((g: any) => ({ ...g, hook: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Caption</label>
                  <textarea className="ci-textarea" rows={6} value={generated.caption} onChange={e => setGenerated((g: any) => ({ ...g, caption: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>CTA</label>
                    <input className="ci-input" value={generated.cta} onChange={e => setGenerated((g: any) => ({ ...g, cta: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Hashtags</label>
                    <input className="ci-input" value={generated.hashtags} onChange={e => setGenerated((g: any) => ({ ...g, hashtags: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Status</label>
                  <select className="ci-select" value={form.status} onChange={e => set('status', e.target.value)}>
                    {['idea','draft','approved','posted'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button className="btn-gold" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            )}
          </div>
        )}

        {!posts.length ? (
          <div className="ci-card text-center py-16">
            <Share2 size={24} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No social posts yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((p: any) => (
              <div key={p.id} className="ci-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold capitalize" style={{ color: 'var(--gold)' }}>{p.platform}</span>
                  <div className="flex items-center gap-2">
                    <select
                      className="text-xs rounded px-2 py-0.5 outline-none cursor-pointer"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-secondary)' }}
                      value={p.status}
                      onChange={e => updateStatus(p.id, e.target.value)}
                    >
                      {['idea','draft','approved','posted'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                {p.hook && <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{p.hook}</p>}
                {p.caption && <p className="text-sm mb-2 whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{p.caption.slice(0, 200)}{p.caption.length > 200 ? '...' : ''}</p>}
                {p.cta && <p className="text-xs font-medium mb-1" style={{ color: 'var(--gold)' }}>{p.cta}</p>}
                {p.hashtags && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.hashtags}</p>}
                <div className="mt-3 pt-3 text-xs" style={{ borderTop: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}>
                  {p.clients?.name && `${p.clients.name} · `}{formatDate(p.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
