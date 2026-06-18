import TopBar from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Settings" />
      <div className="p-6 max-w-xl space-y-6">
        <div className="ci-card space-y-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Account</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-muted)' }}>Email</span>
              <span style={{ color: 'var(--text-primary)' }}>{user?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-muted)' }}>User ID</span>
              <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{user?.id}</span>
            </div>
          </div>
        </div>

        <div className="ci-card space-y-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>Integrations</h2>
          <div className="space-y-3">
            {[
              { name: 'Supabase', status: 'Connected', color: '#34d399' },
              { name: 'Claude AI', status: 'Not connected — add ANTHROPIC_API_KEY', color: '#fbbf24' },
              { name: 'Google PageSpeed API', status: 'Not connected — add GOOGLE_PSI_KEY', color: '#fbbf24' },
              { name: 'Vercel', status: 'Deploy via Vercel CLI', color: '#a78bfa' },
            ].map(({ name, status, color }) => (
              <div key={name} className="flex items-center justify-between p-3 rounded-md" style={{ background: 'var(--bg-elevated)' }}>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{name}</span>
                <span className="text-xs" style={{ color }}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ci-card space-y-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--gold-light, #E8C97A)' }}>About</h2>
          <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <p>Crown Intelligence Mission Control</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Private AI-powered marketing command centre</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Built with Next.js · Supabase · Tailwind CSS</p>
          </div>
        </div>
      </div>
    </div>
  )
}
