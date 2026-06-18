import TopBar from '@/components/layout/TopBar'
import { ImageIcon } from 'lucide-react'

export default function AssetsPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Assets" subtitle="File & media management" />
      <div className="p-6 flex-1 flex items-center justify-center">
        <div className="ci-card text-center py-16 max-w-md w-full">
          <ImageIcon size={32} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Asset Management</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Connect Supabase Storage to enable file uploads, brand assets, and media management.
            Configure the <code className="px-1 rounded text-xs" style={{ background: 'var(--bg-elevated)', color: 'var(--gold)' }}>assets</code> storage bucket to get started.
          </p>
        </div>
      </div>
    </div>
  )
}
