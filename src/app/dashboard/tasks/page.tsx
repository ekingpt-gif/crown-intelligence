'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, statusColor } from '@/lib/utils'
import TopBar from '@/components/layout/TopBar'
import { CheckSquare, Plus, Loader2, Trash2 } from 'lucide-react'

const EMPTY = { client_id: '', title: '', description: '', status: 'todo', priority: 'medium', due_date: '' }

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [{ data: t }, { data: c }] = await Promise.all([
      supabase.from('tasks').select('*,clients(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('id,name').order('name'),
    ])
    setTasks(t ?? [])
    setClients(c ?? [])
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('tasks').insert({ ...form, user_id: user!.id, client_id: form.client_id || null, due_date: form.due_date || null })
    setForm(EMPTY)
    setShowForm(false)
    setSaving(false)
    loadData()
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('tasks').update({ status }).eq('id', id)
    loadData()
  }

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    loadData()
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  const priorityIcon = (p: string) => p === 'high' ? '🔴' : p === 'medium' ? '🟡' : '⚪'

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Tasks" subtitle={`${tasks.filter(t => t.status !== 'done').length} open`} actions={
        <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> New Task
        </button>
      } />
      <div className="p-6 flex-1 space-y-4">
        {showForm && (
          <div className="ci-card max-w-xl space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>New Task</h2>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Task Title *</label>
              <input className="ci-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Write Instagram content for July" />
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
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Priority</label>
                <select className="ci-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
                <select className="ci-select" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Due Date</label>
                <input className="ci-input" type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
              <textarea className="ci-textarea" rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-gold" onClick={handleSave} disabled={saving || !form.title}>
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Create Task'}
              </button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'todo', 'in_progress', 'done'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="text-xs px-3 py-1.5 rounded-md transition-colors"
              style={{
                background: filter === f ? 'rgba(201,168,76,0.1)' : 'var(--bg-elevated)',
                color: filter === f ? 'var(--gold-light, #E8C97A)' : 'var(--text-muted)',
                border: `1px solid ${filter === f ? 'var(--gold-muted)' : 'var(--bg-border)'}`,
              }}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {!filtered.length ? (
          <div className="ci-card text-center py-16">
            <CheckSquare size={24} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No tasks {filter !== 'all' ? `with status "${filter}"` : 'yet'}.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((t: any) => (
              <div key={t.id} className="ci-card flex items-center gap-4">
                <span className="text-base flex-shrink-0">{priorityIcon(t.priority)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: t.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>
                    {t.title}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {t.clients?.name && `${t.clients.name} · `}
                    {t.due_date && `Due ${formatDate(t.due_date)} · `}
                    {formatDate(t.created_at)}
                  </div>
                </div>
                <select
                  className="text-xs rounded px-2 py-1 outline-none cursor-pointer flex-shrink-0"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-secondary)' }}
                  value={t.status}
                  onChange={e => updateStatus(t.id, e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button onClick={() => deleteTask(t.id)} className="text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
