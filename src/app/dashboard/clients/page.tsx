import { createClient } from '@/lib/supabase/server'
import { formatDate, statusColor } from '@/lib/utils'
import Link from 'next/link'
import { Plus, Globe, Mail, Phone } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('name')

  const statusGroups = ['active', 'lead', 'paused', 'archived']

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Clients"
        subtitle={`${clients?.length ?? 0} total`}
        actions={
          <Link href="/dashboard/clients/new" className="btn-gold">
            <Plus size={14} /> Add Client
          </Link>
        }
      />
      <div className="p-6 flex-1">
        {!clients?.length ? (
          <div className="text-center py-20">
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No clients yet. Add your first client to get started.</p>
            <Link href="/dashboard/clients/new" className="btn-gold">
              <Plus size={14} /> Add First Client
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clients.map(client => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="ci-card hover:border-[#8B6914] transition-colors block"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 mr-3">
                    <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{client.name}</h3>
                    {client.industry && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{client.industry}</p>
                    )}
                  </div>
                  <span className={`status-badge flex-shrink-0 ${statusColor(client.status)}`}>{client.status}</span>
                </div>

                <div className="space-y-1.5">
                  {client.website_url && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Globe size={12} />
                      <span className="truncate">{client.website_url}</span>
                    </div>
                  )}
                  {client.contact_email && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Mail size={12} />
                      <span className="truncate">{client.contact_email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Phone size={12} />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 text-xs" style={{ borderTop: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}>
                  Added {formatDate(client.created_at)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
