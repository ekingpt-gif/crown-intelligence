import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ClientWorkspace from './ClientWorkspace'

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase.from('clients').select('*').eq('id', id).single()
  if (!client) notFound()

  const [
    { data: audits },
    { data: seoReports },
    { data: content },
    { data: socialPosts },
    { data: adCampaigns },
    { data: tasks },
    { data: reports },
  ] = await Promise.all([
    supabase.from('website_audits').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('seo_reports').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('content_items').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('social_posts').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('ad_campaigns').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('tasks').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('generated_reports').select('*').eq('client_id', id).order('created_at', { ascending: false }),
  ])

  return (
    <ClientWorkspace
      client={client}
      audits={audits ?? []}
      seoReports={seoReports ?? []}
      content={content ?? []}
      socialPosts={socialPosts ?? []}
      adCampaigns={adCampaigns ?? []}
      tasks={tasks ?? []}
      reports={reports ?? []}
    />
  )
}
