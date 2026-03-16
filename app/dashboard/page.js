import { getDashboardData } from 'lib/dashboard-data';

export const metadata = {
  title: 'Dashboard — Crown Intelligence',
  description: 'Internal operating dashboard for the Crown Intelligence information kingdom.',
};

function StatCard({ label, value, change }) {
  return (
    <div className="kingdom-stat-card">
      <span className="kingdom-card-label">{label}</span>
      <strong>{value}</strong>
      <span className="kingdom-card-foot">{change}</span>
    </div>
  );
}

function SectionHeader({ eyebrow, title, copy }) {
  return (
    <div className="kingdom-section-head">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p className="lead">{copy}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const { overview, businesses, jobs, agents, activity, memory } = await getDashboardData();
  const priorityJobs = jobs.filter((job) => job.priority === 'Critical' || job.priority === 'High');

  return (
    <main className="kingdom-dashboard">
      <section className="kingdom-shell kingdom-hero-shell">
        <div className="kingdom-topbar">
          <a href="/" className="brand kingdom-brand">
            <span className="brand-mark"><span className="brand-monogram">C</span></span>
            <span className="logo-lockup">
              <span className="logo-kicker">Internal Command</span>
              <span className="logo-wordmark">CROWN INTELLIGENCE</span>
            </span>
          </a>
          <a href="/" className="btn btn-secondary kingdom-backlink">Back to landing page</a>
        </div>

        <div className="kingdom-hero-grid">
          <div className="kingdom-hero-copy">
            <span className="eyebrow">{overview.title}</span>
            <h1>{overview.subtitle}</h1>
            <p className="lead">{overview.northStar}</p>
            <div className="kingdom-status-row">
              <div className="kingdom-status-pill">
                <span className="kingdom-status-dot" />
                {overview.status}
              </div>
              <span className="kingdom-status-date">As of {overview.asOf}</span>
            </div>
          </div>

          <div className="kingdom-command-card">
            <span className="kingdom-card-label">Command focus</span>
            <h3>Run the business like an operating system, not a scattered project.</h3>
            <p>
              This dashboard is the command surface for businesses, agent delegation, jobs, market signals,
              and memory continuity.
            </p>
            <div className="kingdom-command-grid">
              {overview.metrics.map((metric) => (
                <StatCard key={metric.label} {...metric} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kingdom-shell kingdom-section-grid">
        <div className="kingdom-section-span-8">
          <SectionHeader
            eyebrow="Businesses"
            title="Active ventures in the kingdom"
            copy="Start with one flagship business, then expand the operating stack as the portfolio grows."
          />
          <div className="kingdom-business-grid">
            {businesses.map((business, index) => (
              <article className="kingdom-business-card" key={business.id}>
                <div className="kingdom-card-topline">
                  <span className="kingdom-rank">#{String(index + 1).padStart(2, '0')}</span>
                  <span className="kingdom-badge">{business.priority}</span>
                </div>
                <h3>{business.name}</h3>
                <p>{business.tagline}</p>
                <div className="kingdom-meta-grid">
                  <div>
                    <span className="kingdom-card-label">Stage</span>
                    <strong>{business.stage}</strong>
                  </div>
                  <div>
                    <span className="kingdom-card-label">Owner</span>
                    <strong>{business.owner}</strong>
                  </div>
                </div>
                <div className="kingdom-list-block">
                  <span className="kingdom-card-label">Current mandate</span>
                  <p>{business.currentMandate}</p>
                </div>
                <div className="kingdom-list-columns">
                  <div>
                    <span className="kingdom-card-label">Focus areas</span>
                    <ul>
                      {business.focus.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="kingdom-card-label">Revenue model</span>
                    <ul>
                      {business.revenueModel.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="kingdom-section-span-4 kingdom-stack">
          <div className="kingdom-side-card">
            <SectionHeader
              eyebrow="Overview"
              title="Immediate state"
              copy="A quick read on what matters right now."
            />
            <div className="kingdom-mini-metric-list">
              {overview.metrics.map((metric) => (
                <div className="kingdom-mini-metric" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="kingdom-side-card">
            <SectionHeader
              eyebrow="Memory / Session"
              title="Continuity status"
              copy="Minimal workspace memory scaffolding is in place so context can compound safely."
            />
            <div className="kingdom-session-box">
              <span className="kingdom-card-label">Session status</span>
              <strong>{memory.sessionStatus}</strong>
              <span className="kingdom-card-foot">Last sync: {memory.lastSync}</span>
            </div>
            <ul className="kingdom-note-list">
              {memory.notes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="kingdom-shell kingdom-section-grid">
        <div className="kingdom-section-span-7">
          <SectionHeader
            eyebrow="Jobs / Tasks"
            title="Priority work queue"
            copy="High-leverage work is surfaced first so execution stays clear and commercial."
          />
          <div className="kingdom-job-table">
            <div className="kingdom-job-table-head">
              <span>Task</span>
              <span>Domain</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Owner</span>
            </div>
            {priorityJobs.map((job) => (
              <div className="kingdom-job-row" key={job.id}>
                <strong>{job.title}</strong>
                <span>{job.domain}</span>
                <span>{job.priority}</span>
                <span>{job.status}</span>
                <span>{job.owner}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="kingdom-section-span-5">
          <SectionHeader
            eyebrow="Activity / Signals"
            title="Recent movement"
            copy="Signals, ops changes, and strategic updates flow here."
          />
          <div className="kingdom-activity-list">
            {activity.map((item) => (
              <article className="kingdom-activity-item" key={`${item.time}-${item.title}`}>
                <div className="kingdom-activity-time">{item.time}</div>
                <div>
                  <div className="kingdom-activity-type">{item.type}</div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kingdom-shell kingdom-agent-shell">
        <SectionHeader
          eyebrow="Agents"
          title="The four main operators"
          copy="A command layer and three specialist agents define who owns what inside Crown Intelligence."
        />
        <div className="kingdom-agent-grid">
          {agents.map((agent) => (
            <article className="kingdom-agent-card" key={agent.id}>
              <div className="kingdom-card-topline">
                <span className="kingdom-badge">{agent.status}</span>
                <span className="kingdom-card-label">{agent.role}</span>
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.currentMandate}</p>
              <div className="kingdom-list-columns">
                <div>
                  <span className="kingdom-card-label">Responsibilities</span>
                  <ul>
                    {agent.responsibilities.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="kingdom-card-label">Task ownership</span>
                  <ul>
                    {agent.taskOwnership.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
              <div className="kingdom-kpi-strip">
                {agent.kpis.map((kpi) => (
                  <span key={kpi}>{kpi}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
