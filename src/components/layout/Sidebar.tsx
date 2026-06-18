'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Users, FolderKanban, Globe, BarChart3,
  PenSquare, Share2, Megaphone, ImageIcon, CheckSquare,
  FileText, Settings, ChevronLeft, ChevronRight, Crown, LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/website-health', label: 'Website Health', icon: Globe },
  { href: '/dashboard/seo-reports', label: 'SEO Reports', icon: BarChart3 },
  { href: '/dashboard/content-studio', label: 'Content Studio', icon: PenSquare },
  { href: '/dashboard/social-posts', label: 'Social Posts', icon: Share2 },
  { href: '/dashboard/ad-campaigns', label: 'Ad Campaigns', icon: Megaphone },
  { href: '/dashboard/assets', label: 'Assets', icon: ImageIcon },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-200"
      style={{
        width: collapsed ? 64 : 220,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--bg-border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5" style={{ borderBottom: '1px solid var(--bg-border)' }}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
          <Crown size={15} color="#000" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-tight leading-none" style={{ color: 'var(--gold-light, #E8C97A)' }}>Crown</div>
            <div className="text-xs leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>Intelligence</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-100"
              style={{
                color: active ? 'var(--gold-light, #E8C97A)' : 'var(--text-secondary)',
                background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
                fontWeight: active ? 500 : 400,
              }}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 space-y-0.5" style={{ borderTop: '1px solid var(--bg-border)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm w-full transition-all"
          style={{ color: 'var(--text-muted)' }}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm w-full transition-all"
          style={{ color: 'var(--text-muted)' }}
        >
          {collapsed
            ? <ChevronRight size={16} />
            : <><ChevronLeft size={16} /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  )
}
