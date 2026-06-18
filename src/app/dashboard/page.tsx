import { createClient } from '@/lib/supabase/server'
import { formatDate, statusColor } from '@/lib/utils'
import { Users, CheckSquare, Globe, PenSquare, FileText, Crown, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: clients },
    { data: tasks },
    { data: audits },
    { data: content },
    { data: reports },
  ] = await Promise.all([
    supabase.from('clients').select('id,name,status,industry,updated_at').order('updated_at', { ascending: false }),
    supabase.from('tasks').select('id,title,status,priority,due_date').neq('status', 'done').order('created_at', { ascending: false }).limit(5),
    supabase.from('website_audits').select('id,url,performance_score,seo_score,created_at,clients(name)').order('created_at', { ascending: false }).limit(5),
    supabase.from('content_items').select('id,title,type,status,created_at,clients(name)').order('created_at', { ascending: false }).limit(5),
    supabase.from('generated_reports').select('id,title,status,created_at,clients(name)').order('created_at', { ascending: false }).limit(5),
  ])

  const activeClients = clients?.filter(c => c.status === 'active').length ?? 0
  const openTasks = tasks?.length ?? 0

  const statCards = [
    { label: 'Active Clients', value: activeClients, icon: Users, href: '/dashboard/clients', color: '#C9A84C' },
    { label: 'Open Tasks', value: openTasks, icon: CheckSquare, href: '/dashboard/tasks', color: '#60a5fa' },
    { label: 'Website Audits', value: audits?.length ?? 0, icon: Globe, href: '/dashboard/website-health', color: '#34d399' },
    { label: 'Content Items', value: content?.length ?? 0, icon: PenSquare, href: '/dashboard/content-studio', color: '#a78bfa' },
    { label: 'Reports', value: reports?.length ?? 0, icon: FileText, href: '/dashboard/reports', color: '#f59e0b' },
  ]

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
          <Crown size={16} color="#000" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Mission Control</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Crown Intelligence Dashboard</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="ci-card hover:border-[var(--gold-muted)] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <Icon size={16} style={{ color }} />
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Cards */}
        <div className="ci-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Clients</h2>
            <Link href="/dashboard/clients/new" className="text-xs" style={{ color: 'var(--gold)' }}>+ Add client</Link>
          </div>
          {!clients?.length ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No clients yet.</p>
          ) : (
            <div className="space-y-2">
              {clients.slice(0, 6).map(c => (
                <Link key={c.id} href={`/dashboard/clients/${c.id}`}
                  className="flex items-center justify-between p-2.5 rounded-md transition-colors"
                  style={{ background: 'var(--bg-elevated)' }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</div>
                    {c.industry && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.industry}</div>}
                  </div>
                  <span className={`status-badge ${statusColor(c.status)}`}>{c.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Open Tasks */}
        <div className="ci-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Open Tasks</h2>
            <Link href="/dashboard/tasks" className="text-xs" style={{ color: 'var(--gold)' }}>View all</Link>
          </div>
          {!tasks?.length ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No open tasks.</p>
          ) : (
            <div className="space-y-2">
              {tasks.map(t => (
                <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-md" style={{ background: 'var(--bg-elevated)' }}>
                  <AlertCircle size={14} style={{ color: t.priority === 'high' ? '#f87171' : t.priority === 'medium' ? '#fbbf24' : '#6b7280' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{t.title}</div>
                    {t.due_date && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Due {formatDate(t.due_date)}</div>}
                  </div>
                  <span className={`status-badge ${statusColor(t.status)}`}>{t.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Audits */}
        <div className="ci-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Audits</h2>
            <Link href="/dashboard/website-health" className="text-xs" style={{ color: 'var(--gold)' }}>View all</Link>
          </div>
          {!audits?.length ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No audits yet.</p>
          ) : (
            <div className="space-y-2">
              {audits.map((a: any) => (
                <div key={a.id} className="p-2.5 rounded-md" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm truncate mr-2" style={{ color: 'var(--text-primary)' }}>{a.url}</div>
                    <div className="flex gap-2 flex-shrink-0">
                      {a.performance_score != null && (
                        <span className="text-xs font-mono" style={{ color: a.performance_score >= 80 ? '#34d399' : a.performance_score >= 60 ? '#fbbf24' : '#f87171' }}>
                          {a.performance_score}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {a.clients?.name && `${a.clients.name} · `}{formatDate(a.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Content */}
        <div className="ci-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Content</h2>
            <Link href="/dashboard/content-studio" className="text-xs" style={{ color: 'var(--gold)' }}>View all</Link>
          </div>
          {!content?.length ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No content yet.</p>
          ) : (
            <div className="space-y-2">
              {content.map((c: any) => (
                <div key={c.id} className="p-2.5 rounded-md" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm truncate mr-2" style={{ color: 'var(--text-primary)' }}>{c.title}</div>
                    <span className={`status-badge ${statusColor(c.status)}`}>{c.status}</span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {c.type?.replace(/_/g, ' ')} {c.clients?.name && `· ${c.clients.name}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
