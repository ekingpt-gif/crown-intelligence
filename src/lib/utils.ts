import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function statusColor(status: string) {
  const map: Record<string, string> = {
    active: 'text-emerald-400 bg-emerald-400/10',
    lead: 'text-amber-400 bg-amber-400/10',
    paused: 'text-zinc-400 bg-zinc-400/10',
    archived: 'text-zinc-600 bg-zinc-600/10',
    draft: 'text-zinc-400 bg-zinc-400/10',
    reviewed: 'text-amber-400 bg-amber-400/10',
    sent: 'text-emerald-400 bg-emerald-400/10',
    idea: 'text-zinc-400 bg-zinc-400/10',
    approved: 'text-emerald-400 bg-emerald-400/10',
    posted: 'text-amber-400 bg-amber-400/10',
    planning: 'text-blue-400 bg-blue-400/10',
    completed: 'text-emerald-400 bg-emerald-400/10',
    todo: 'text-zinc-400 bg-zinc-400/10',
    in_progress: 'text-amber-400 bg-amber-400/10',
    done: 'text-emerald-400 bg-emerald-400/10',
    high: 'text-red-400 bg-red-400/10',
    medium: 'text-amber-400 bg-amber-400/10',
    low: 'text-zinc-400 bg-zinc-400/10',
  }
  return map[status] ?? 'text-zinc-400 bg-zinc-400/10'
}

export function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-amber-400'
  return 'text-red-400'
}
