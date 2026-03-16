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

function ToneBadge({ tone, children }) {
  return <span className={`kingdom-chip ${tone ? `is-${tone}` : ''}`}>{children}</span>;
}

export default async function DashboardPage() {
  const { overview, businesses, jobs, jobLanes, agents, activity, memory } = await getDashboardData();
  const flagship = businesses[0];

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
            <h3>{overview.commandCenter.headline}</h3>
            <p>{overview.commandCenter.body}</p>
            <div className="kingdom-command-grid">
              {overview.metrics.map((metric) => (
                <StatCard key={metric.label} {...metric} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kingdom-shell kingdom-section-grid">
        <div className="kingdom-section-span-8 kingdom-stack">
          <div className="kingdom-business-card kingdom-flagship-card">
            <SectionHeader
              eyebrow="Flagship business"
              title={`${flagship.name} status`}
              copy={flagship.stageSummary}
            />

            <div className="kingdom-business-status-grid">
              <div className="kingdom-business-main">
                <div className="kingdom-card-topline">
                  <ToneBadge>{flagship.priority}</ToneBadge>
                  <span className="kingdom-card-label">Owner: {flagship.owner}</span>
                </div>
                <h3>{flagship.tagline}</h3>
                <p>{flagship.currentMandate}</p>

                <div className="kingdom-meta-grid">
                  <div>
                    <span className="kingdom-card-label">Stage</span>
                    <strong>{flagship.stage}</strong>
                  </div>
                  <div>
                    <span className="kingdom-card-label">Revenue model</span>
                    <strong>{flagship.revenueModel.join(' • ')}</strong>
                  </div>
                </div>

                <div className="kingdom-progress-strip">
                  {flagship.progressMarkers.map((marker) => (
                    <div className="kingdom-progress-card" key={marker.label}>
                      <span className="kingdom-card-label">{marker.label}</span>
                      <ToneBadge tone={marker.tone}>{marker.value}</ToneBadge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="kingdom-business-side">
                <div className="kingdom-list-block">
                  <span className="kingdom-card-label">Current priorities</span>
                  <ul className="kingdom-note-list">
                    {flagship.priorities.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="kingdom-list-block">
                  <span className="kingdom-card-label">Bottlenecks</span>
                  <ul className="kingdom-note-list">
                    {flagship.bottlenecks.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="kingdom-section-grid kingdom-nested-grid">
            <div className="kingdom-section-span-6">
              <div className="kingdom-side-card kingdom-detail-card">
                <SectionHeader
                  eyebrow="Assets"
                  title="What already exists"
                  copy="These are the operating and brand assets currently carrying the business forward."
                />
                <ul className="kingdom-note-list">
                  {flagship.assets.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
            <div className="kingdom-section-span-6">
              <div className="kingdom-side-card kingdom-detail-card">
                <SectionHeader
                  eyebrow="Offers"
                  title="Commercial surface area"
                  copy="Offer packaging is visible here so the business can be managed like a real revenue machine."
                />
                <div className="kingdom-offer-stack">
                  {flagship.offers.map((offer) => (
                    <article className="kingdom-offer-card" key={offer.name}>
                      <div className="kingdom-card-topline">
                        <h3>{offer.name}</h3>
                        <ToneBadge>{offer.status}</ToneBadge>
                      </div>
                      <p>{offer.detail}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="kingdom-section-span-4 kingdom-stack">
          <div className="kingdom-side-card">
            <SectionHeader
              eyebrow="Command / Decisions"
              title="Operating directives"
              copy="The business should move under a few explicit rules, not vague ambition."
            />
            <ul className="kingdom-note-list">
              {overview.commandCenter.directives.map((directive) => <li key={directive}>{directive}</li>)}
            </ul>
            <div className="kingdom-decision-list">
              {overview.commandCenter.decisionPanel.map((item) => (
                <div className="kingdom-mini-metric" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="kingdom-side-card">
            <SectionHeader
              eyebrow="Memory / Session"
              title="Continuity status"
              copy="This checks the actual workspace scaffold so the dashboard shows what exists, not just what was intended."
            />
            <div className="kingdom-session-box">
              <span className="kingdom-card-label">Session status</span>
              <strong>{memory.sessionStatus}</strong>
              <span className="kingdom-card-foot">Last sync: {memory.lastSync}</span>
            </div>
            <div className="kingdom-memory-summary">
              <div className="kingdom-mini-metric">
                <span>Scaffold score</span>
                <strong>{memory.scaffoldScore}</strong>
              </div>
              <div className="kingdom-mini-metric">
                <span>Long-term memory</span>
                <strong>{memory.longTermReady ? 'Present' : 'Missing'}</strong>
              </div>
              <div className="kingdom-mini-metric">
                <span>Daily note system</span>
                <strong>{memory.dailyReady ? 'Present' : 'Missing'}</strong>
              </div>
            </div>
            <div className="kingdom-checklist">
              {memory.checks.map((check) => (
                <div className="kingdom-check-item" key={check.label}>
                  <ToneBadge tone={check.exists ? 'good' : 'warn'}>{check.exists ? 'Exists' : 'Missing'}</ToneBadge>
                  <div>
                    <strong>{check.label}</strong>
                    <span>{check.path}</span>
                  </div>
                </div>
              ))}
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
            title="Execution lanes"
            copy="Work is grouped by operational state so the business can be run through flow, not a flat checklist."
          />
          <div className="kingdom-lane-grid">
            {jobLanes.map((lane) => (
              <div className="kingdom-lane-card" key={lane.lane}>
                <div className="kingdom-card-topline">
                  <h3>{lane.lane}</h3>
                  <ToneBadge>{lane.jobs.length} jobs</ToneBadge>
                </div>
                <div className="kingdom-lane-stack">
                  {lane.jobs.map((job) => (
                    <article className="kingdom-job-card" key={job.id}>
                      <div className="kingdom-card-topline">
                        <ToneBadge>{job.priority}</ToneBadge>
                        <span className="kingdom-card-label">{job.status}</span>
                      </div>
                      <h4>{job.title}</h4>
                      <p>{job.summary}</p>
                      <div className="kingdom-job-meta">
                        <span>{job.domain}</span>
                        <span>{job.owner}</span>
                      </div>
                      <div className="kingdom-job-output">
                        <span className="kingdom-card-label">Next output</span>
                        <strong>{job.nextOutput}</strong>
                      </div>
                    </article>
                  ))}
                </div>
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
          copy="Each agent now shows ownership, cadence, outputs, and dependencies so the model feels closer to a real AI-run business stack."
        />
        <div className="kingdom-agent-grid">
          {agents.map((agent) => (
            <article className="kingdom-agent-card" key={agent.id}>
              <div className="kingdom-card-topline">
                <ToneBadge>{agent.status}</ToneBadge>
                <span className="kingdom-card-label">{agent.role}</span>
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.currentMandate}</p>

              <div className="kingdom-agent-meta-grid">
                <div>
                  <span className="kingdom-card-label">Ownership</span>
                  <strong>{agent.ownership}</strong>
                </div>
                <div>
                  <span className="kingdom-card-label">Cadence</span>
                  <strong>{agent.cadence}</strong>
                </div>
              </div>

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

              <div className="kingdom-list-columns">
                <div>
                  <span className="kingdom-card-label">Outputs</span>
                  <ul>
                    {agent.outputs.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="kingdom-card-label">Dependencies</span>
                  <ul>
                    {agent.dependencies.map((item) => <li key={item}>{item}</li>)}
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
