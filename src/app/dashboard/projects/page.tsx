'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, statusColor } from '@/lib/utils'
import TopBar from '@/components/layout/TopBar'
import { FolderKanban, Plus, Loader2, Trash2 } from 'lucide-react'

const EMPTY = { client_id: '', name: '', description: '', status: 'active', due_date: '' }

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('projects').select('*,clients(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('id,name').order('name'),
    ])
    setProjects(p ?? [])
    setClients(c ?? [])
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('projects').insert({ ...form, user_id: user!.id, client_id: form.client_id || null, due_date: form.due_date || null })
    setForm(EMPTY)
    setShowForm(false)
    setSaving(false)
    loadData()
  }

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    loadData()
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Projects" subtitle={`${projects.length} total`} actions={
        <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> New Project
        </button>
      } />
      <div className="p-6 flex-1 space-y-4">
        {showForm && (
          <div className="ci-card max-w-xl space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>New Project</h2>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Project Name *</label>
              <input className="ci-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Website Redesign" />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                  <option value="active">Active</option>
                  <option value="planning">Planning</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Due Date</label>
                <input className="ci-input" type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
              <textarea className="ci-textarea" rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-gold" onClick={handleSave} disabled={saving || !form.name}>
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Create Project'}
              </button>
            </div>
          </div>
        )}

        {!projects.length ? (
          <div className="ci-card text-center py-16">
            <FolderKanban size={24} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((p: any) => (
              <div key={p.id} className="ci-card">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`status-badge ${statusColor(p.status)}`}>{p.status}</span>
                    <button onClick={() => deleteProject(p.id)} className="text-zinc-600 hover:text-red-400">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                {p.clients?.name && <p className="text-xs mb-2" style={{ color: 'var(--gold)' }}>{p.clients.name}</p>}
                {p.description && <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>}
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {p.due_date && `Due ${formatDate(p.due_date)} · `}{formatDate(p.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
