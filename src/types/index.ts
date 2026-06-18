export type ClientStatus = 'lead' | 'active' | 'paused' | 'archived'
export type ReportStatus = 'draft' | 'reviewed' | 'sent'
export type PostStatus = 'idea' | 'draft' | 'approved' | 'posted'
export type CampaignStatus = 'planning' | 'active' | 'paused' | 'completed'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type ContentType = 'blog_idea' | 'blog_article' | 'website_copy' | 'email_campaign' | 'landing_page' | 'offer_positioning'
export type SocialPlatform = 'instagram' | 'linkedin' | 'facebook' | 'tiktok' | 'reel' | 'carousel'
export type AdPlatform = 'meta' | 'google'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  website_url: string | null
  industry: string | null
  contact_name: string | null
  contact_email: string | null
  phone: string | null
  notes: string | null
  brand_voice: string | null
  target_audience: string | null
  services: string | null
  competitors: string | null
  status: ClientStatus
  instagram: string | null
  facebook: string | null
  tiktok: string | null
  linkedin: string | null
  youtube: string | null
  twitter: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  client_id: string | null
  name: string
  description: string | null
  status: string
  due_date: string | null
  created_at: string
  clients?: Pick<Client, 'id' | 'name'>
}

export interface WebsiteAudit {
  id: string
  user_id: string
  client_id: string | null
  url: string
  performance_score: number | null
  seo_score: number | null
  mobile_score: number | null
  technical_score: number | null
  conversion_score: number | null
  performance_notes: string | null
  seo_notes: string | null
  mobile_notes: string | null
  technical_notes: string | null
  conversion_notes: string | null
  suggested_fixes: string | null
  created_at: string
  clients?: Pick<Client, 'id' | 'name'>
}

export interface SeoReport {
  id: string
  user_id: string
  client_id: string | null
  title: string
  page_title_review: string | null
  meta_description_review: string | null
  heading_structure: string | null
  keyword_opportunities: string | null
  local_seo: string | null
  content_gaps: string | null
  competitor_notes: string | null
  priority_actions: string | null
  status: ReportStatus
  created_at: string
  clients?: Pick<Client, 'id' | 'name'>
}

export interface ContentItem {
  id: string
  user_id: string
  client_id: string | null
  type: ContentType
  title: string
  body: string | null
  status: string
  created_at: string
  clients?: Pick<Client, 'id' | 'name'>
}

export interface SocialPost {
  id: string
  user_id: string
  client_id: string | null
  platform: SocialPlatform
  caption: string | null
  hook: string | null
  cta: string | null
  hashtags: string | null
  status: PostStatus
  created_at: string
  clients?: Pick<Client, 'id' | 'name'>
}

export interface AdCampaign {
  id: string
  user_id: string
  client_id: string | null
  platform: AdPlatform
  campaign_name: string
  objective: string | null
  offer: string | null
  audience: string | null
  angle: string | null
  primary_text: string | null
  headline: string | null
  cta: string | null
  budget: string | null
  notes: string | null
  status: CampaignStatus
  created_at: string
  clients?: Pick<Client, 'id' | 'name'>
}

export interface Asset {
  id: string
  user_id: string
  client_id: string | null
  name: string
  file_url: string
  file_type: string
  size: number | null
  notes: string | null
  created_at: string
  clients?: Pick<Client, 'id' | 'name'>
}

export interface Task {
  id: string
  user_id: string
  client_id: string | null
  project_id: string | null
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  created_at: string
  clients?: Pick<Client, 'id' | 'name'>
}

export interface GeneratedReport {
  id: string
  user_id: string
  client_id: string | null
  title: string
  content: string | null
  status: ReportStatus
  created_at: string
  clients?: Pick<Client, 'id' | 'name'>
}
