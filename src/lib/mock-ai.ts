// Mock AI generation functions — swap for real Claude/OpenAI API calls

export async function generateContent(
  type: string,
  clientName: string,
  context: string
): Promise<string> {
  await new Promise(r => setTimeout(r, 800))

  const templates: Record<string, string> = {
    blog_idea: `**5 Blog Ideas for ${clientName}**

1. "How ${clientName} Helps [Target Audience] Achieve [Goal]"
2. "The Ultimate Guide to [Industry Topic] in [Year]"
3. "Why [Problem Your Audience Has] Is Costing You More Than You Think"
4. "Behind the Scenes: How We Deliver Results for Our Clients"
5. "[Number] Things Most [Industry] Businesses Get Wrong"

*Add your real Claude API key to generate custom ideas based on client context.*`,

    blog_article: `# [Article Title for ${clientName}]

## Introduction

In today's competitive landscape, [target audience] face a common challenge: [problem]. That's where ${clientName} comes in.

## The Problem

Most businesses struggle with [pain point]. Without the right strategy, you risk [consequence].

## Our Solution

At ${clientName}, we've developed a proven approach that [key benefit]. Here's how it works:

### Step 1: [Action]
[Description of step one]

### Step 2: [Action]
[Description of step two]

### Step 3: [Action]
[Description of step three]

## Results You Can Expect

Our clients typically see:
- [Result 1]
- [Result 2]
- [Result 3]

## Conclusion

Ready to [desired outcome]? [Call to action for ${clientName}].

*Connect Claude API to generate full articles tailored to your client's brand voice.*`,

    website_copy: `## Hero Section
**Headline:** [Bold, Benefit-Driven Headline for ${clientName}]
**Subheading:** [Supporting statement that clarifies who you help and how]
**CTA:** Get Started Today

## About Section
${clientName} is [description]. We specialize in [services] for [target audience].

## Services Section
**Service 1:** [Name] — [Short description]
**Service 2:** [Name] — [Short description]
**Service 3:** [Name] — [Short description]

## Social Proof
"[Testimonial placeholder]" — Happy Client

## CTA Section
**Ready to [outcome]?**
Book your free consultation today.

*Add Claude API to generate copy based on brand voice and offer notes.*`,

    email_campaign: `**Subject Line Options:**
1. [Urgency/Benefit Subject]
2. [Question Subject]
3. [Story Subject]

---

Hi [First Name],

[Opening hook — relate to a pain point or desire]

[Body — introduce your offer or insight]

[Middle — proof, story, or value]

[Close — clear CTA]

[Your name]
${clientName}

P.S. [Reinforce the offer or add urgency]

*Connect Claude API for personalized email sequences.*`,

    landing_page: `## Above the Fold
**Headline:** [Primary Benefit Statement]
**Sub-headline:** [Clarify who it's for and what they get]
**CTA Button:** [Action Word] Now

## Problem Section
You're here because [pain point]. You've tried [failed solutions]. You know there's a better way.

## Solution Section
Introducing [Offer Name] from ${clientName}.
[Description of what it is and how it works]

## Features & Benefits
✓ [Benefit 1]
✓ [Benefit 2]
✓ [Benefit 3]

## Social Proof
[Testimonials, logos, results]

## Guarantee
[Risk reversal statement]

## Final CTA
[Strong call to action]

*Add Claude API to tailor landing pages to each client's offer.*`,

    offer_positioning: `**Offer Positioning for ${clientName}**

**Core Offer:** [What you sell]
**Target Audience:** [Who it's for]
**Primary Pain Point:** [What they struggle with]
**Promised Outcome:** [What they get]
**Timeframe:** [How long it takes]
**Differentiator:** [Why ${clientName} is different]

**Elevator Pitch:**
"We help [audience] achieve [outcome] in [timeframe] without [objection], even if [limiting belief]."

**Pricing Anchoring:**
[Premium framing for your offer]

**Objection Handling:**
- "It's too expensive" → [Response]
- "I don't have time" → [Response]
- "I'm not sure it'll work" → [Response]

*Add Claude API to generate custom positioning based on brand voice and competitor notes.*`,
  }

  return templates[type] || `Generated content for ${clientName}. Add Claude API key for real AI generation.`
}

export async function generateSocialPost(
  platform: string,
  clientName: string,
  context: string
): Promise<{ caption: string; hook: string; cta: string; hashtags: string }> {
  await new Promise(r => setTimeout(r, 600))

  return {
    hook: `Did you know that [striking fact related to ${clientName}'s industry]?`,
    caption: `Here's what most ${clientName} clients don't realize until it's too late...\n\n[Main content point]\n\nThe good news? [Solution].\n\nWe've helped [number] clients achieve [outcome]. Here's the process:\n\n→ Step 1: [Action]\n→ Step 2: [Action]\n→ Step 3: [Result]\n\nReady to [desired outcome]?`,
    cta: `DM us "READY" to get started`,
    hashtags: `#${slugify(clientName)} #marketing #business #growth #success`,
  }
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '').replace(/[^\w]+/g, '')
}

export async function generateAuditScores(url: string): Promise<{
  performance: number
  seo: number
  mobile: number
  technical: number
  conversion: number
  notes: Record<string, string>
}> {
  await new Promise(r => setTimeout(r, 1000))

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

  return {
    performance: rand(45, 92),
    seo: rand(50, 88),
    mobile: rand(55, 95),
    technical: rand(40, 85),
    conversion: rand(30, 75),
    notes: {
      performance: 'Page load time could be improved. Consider optimizing images and enabling caching. Connect Google PageSpeed API for real metrics.',
      seo: 'Meta descriptions missing on several pages. Title tags need keyword optimization. Internal linking structure needs improvement.',
      mobile: 'Mobile layout is mostly responsive but tap targets are too small in some areas. Font sizes need adjustment on mobile.',
      technical: 'SSL certificate is valid. Some broken links detected. Missing structured data markup (Schema.org). No sitemap.xml found.',
      conversion: 'Main CTA is not prominent above the fold. No social proof visible on homepage. Contact form is buried. Trust signals missing.',
    },
  }
}
