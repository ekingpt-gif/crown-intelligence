'use client';

import { useEffect, useMemo, useState } from 'react';

const reviews = [
  {
    quote: 'Systems thinking at a completely different level.',
    meta: 'Founder • Service Business Operator',
  },
  {
    quote: 'Our operations changed the moment the architecture got cleaner.',
    meta: 'Agency Owner • Growth-Focused Team',
  },
  {
    quote: 'This made OpenClaw feel practical, strategic, and deployable.',
    meta: 'Consultant • Systems Builder',
  },
  {
    quote: 'Not another AI pitch. Actual leverage.',
    meta: 'Founder • Operations-Led Company',
  },
  {
    quote: 'Sharper positioning. Faster execution. Much less chaos.',
    meta: 'Principal • Advisory Business',
  },
];

export default function Page() {
  const [reviewIndex, setReviewIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dismissed = typeof window !== 'undefined' && sessionStorage.getItem('ci_modal_closed');
    if (dismissed) return;
    const timer = setTimeout(() => setModalOpen(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const reviewTransform = useMemo(() => ({ transform: `translateX(-${reviewIndex * 100}%)` }), [reviewIndex]);

  const closeModal = () => {
    setModalOpen(false);
    if (typeof window !== 'undefined') sessionStorage.setItem('ci_modal_closed', '1');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending…' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setStatus({ type: 'success', message: data.message || 'Thanks — your enquiry has been captured.' });
      setForm({ name: '', email: '', company: '', message: '' });
      closeModal();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong.' });
    }
  };

  return (
    <>
      <div className="nav-shell">
        <header className="nav">
          <div className="nav-inner">
            <a href="#top" className="brand">
              <span className="brand-mark"><span className="brand-monogram">C</span></span>
              <span className="logo-lockup">
                <span className="logo-kicker">Strategic Systems</span>
                <span className="logo-wordmark">CROWN INTELLIGENCE</span>
              </span>
            </a>
            <nav className="nav-links">
              <a href="#problem">Problem</a>
              <a href="#reviews">Proof</a>
              <a href="#guide">Guide</a>
              <a href="#book">Call</a>
              <a className="btn btn-primary" href="#book">BOOK AN AI STRATEGY CALL</a>
            </nav>
          </div>
        </header>
      </div>

      <main id="top">
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-glow" />
          <div className="hero-figure" />
          <div className="hero-overlay" />
          <div className="hero-vignette" />

          <div className="container hero-content">
            <span className="eyebrow">Strategic AI Systems • OpenClaw Deployment</span>
            <h1>Most Companies Buy Tools. We Build Systems That Create Leverage.</h1>
            <p className="lead">Crown Intelligence designs premium AI infrastructure, OpenClaw deployments, and operating systems for founders and operators who want cleaner execution, stronger positioning, and more strategic power.</p>
            <div className="hero-proof" aria-label="Social proof">
              <span className="hero-stars">★★★★★</span>
              <span className="hero-proof-text">Trusted for strategic clarity, implementation depth, and elite systems thinking.</span>
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#book">BOOK AN AI STRATEGY CALL</a>
              <a className="btn btn-secondary" href="#guide">LEARN OPENCLAW FIRST</a>
            </div>
            <p className="hero-status">Deploy OpenClaw properly. Build cleaner systems. Move toward goals faster with less operational drag.</p>
          </div>
        </section>

        <section className="trust-strip">
          <div className="container trust-grid">
            <div className="trust-item">Crown Intelligence is built for businesses that want <span className="red">strategic power</span>, not commodity AI noise.</div>
            <div className="trust-item">AI strategy &amp; deployment</div>
            <div className="trust-item">Automation architecture</div>
            <div className="trust-item">Direct-response systems</div>
          </div>
        </section>

        <section className="section" id="problem">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">The Problem</span>
              <h2>Most businesses do not need more tools. They need stronger architecture.</h2>
              <p className="lead">Without it, they automate fragments, create noise, and mistake motion for leverage.</p>
            </div>

            <div className="issue-grid">
              <div className="issue-pill"><strong>Lost opportunities</strong><p>Weak follow-up and slow routing quietly kill revenue.</p></div>
              <div className="issue-pill"><strong>Founder dependency</strong><p>Everything still depends on memory, oversight, and rescue.</p></div>
              <div className="issue-pill"><strong>Operational noise</strong><p>Disconnected tools create complexity instead of control.</p></div>
            </div>
          </div>
        </section>

        <section className="break-section">
          <div className="break-shell">
            <div className="break-label">Warning</div>
            <div className="break-copy">Most companies do not have an automation problem. They have a systems problem.</div>
            <p className="break-sub">They buy tools. They automate fragments. They never build leverage. The result is more complexity, not more power.</p>
          </div>
        </section>

        <section className="section">
          <div className="container split-section">
            <div className="media-col">
              <div className="visual-tall">
                <div className="visual-core king" />
                <span className="image-kicker">Chess King</span>
              </div>
            </div>
            <div className="text-col">
              <span className="eyebrow">Strategic Position</span>
              <h2>Build from position, not panic.</h2>
              <p className="lead">The strongest businesses do not move randomly. They create structure, read the board, and act from advantage.</p>
              <div className="panel spacer-top">
                <h3>What that looks like</h3>
                <ul className="bullet-list">
                  <li>clear workflows and control points</li>
                  <li>faster response and stronger follow-up</li>
                  <li>systems that hold under pressure</li>
                  <li>less reliance on heroic manual effort</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section compact-top" id="services">
          <div className="container split-section reverse">
            <div className="text-col">
              <span className="eyebrow">Services</span>
              <h2>Strategic services designed for operators, not browsers.</h2>
              <p className="lead">Every engagement is built around leverage: clearer architecture, stronger deployment, better execution.</p>
              <div className="red-cta-bar">
                <p><span className="red">OpenClaw</span> should not sit on the sidelines. It should sit inside a system that drives work forward.</p>
                <a className="btn btn-primary" href="#guide">GET THE INTRO GUIDE</a>
              </div>
            </div>
            <div className="media-col">
              <div className="visual-wide">
                <div className="visual-core stone" />
                <span className="image-kicker">Marble Bust</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section compact-top">
          <div className="container offer-grid">
            <article className="offer-card"><div className="offer-kicker">System Architecture</div><h3>Clarity before complexity.</h3><p>Map the business. Find the bottlenecks. Design the right structure.</p><div className="offer-for">For businesses that need the blueprint first.</div></article>
            <article className="offer-card featured"><div className="offer-kicker">Automation Implementation</div><h3>Done-for-you systems with commercial intent.</h3><p>Deploy automation, routing, follow-up, reporting, and OpenClaw infrastructure that actually improves operations.</p><div className="offer-for">For teams ready to install the machine.</div></article>
            <article className="offer-card"><div className="offer-kicker">Strategic Advisory</div><h3>High-level thinking for serious decisions.</h3><p>Use Crown Intelligence as a strategic partner for deployment, systems thinking, and operating design.</p><div className="offer-for">For founders who want clarity without noise.</div></article>
            <article className="offer-card"><div className="offer-kicker">Strategic Retainer</div><h3>Ongoing access, refinement, and expansion.</h3><p>Continuous optimisation across systems, automation, deployment, and execution.</p><div className="offer-for">For businesses building long-term leverage.</div></article>
          </div>
        </section>

        <section className="section" id="reviews">
          <div className="container review-wrap">
            <div className="review-panel">
              <div className="review-shell">
                <div className="review-track" style={reviewTransform}>
                  {reviews.map((review) => (
                    <article className="review-slide" key={review.quote}>
                      <div>
                        <div className="review-stars">★★★★★</div>
                        <div className="review-quote">“{review.quote}”</div>
                      </div>
                      <div className="review-meta">{review.meta}</div>
                    </article>
                  ))}
                </div>
                <div className="review-nav">
                  {reviews.map((_, index) => (
                    <button key={index} className={`review-dot ${index === reviewIndex ? 'active' : ''}`} aria-label={`Review ${index + 1}`} onClick={() => setReviewIndex(index)} />
                  ))}
                </div>
              </div>
            </div>

            <div className="review-list">
              <span className="eyebrow">Proof</span>
              <h2>Credibility should feel premium, not noisy.</h2>
              <p className="lead">A rotating proof panel keeps the section controlled, cinematic, and believable.</p>
              <div className="review-mini"><strong>Short. Strong. Specific.</strong>Testimonials should reinforce strategic clarity, implementation depth, and commercial impact.</div>
              <div className="review-mini"><strong>Gold stars only where they matter.</strong>Used as a subtle proof signal, not decorative clutter.</div>
              <div className="review-mini"><strong>Movement without gimmicks.</strong>Slow transitions create rhythm and keep the section alive.</div>
            </div>
          </div>
        </section>

        <section className="section tighter-top">
          <div className="container mini-visuals">
            <div className="visual-square"><div className="visual-core smoke" /><div className="visual-core stone soft-layer" /><span className="image-kicker">Dust / Smoke</span></div>
            <div className="visual-square"><div className="visual-core arch" /><div className="visual-core symbols" /><span className="image-kicker">Structure / Strategy</span></div>
          </div>

          <div className="floating-card">
            <div className="floating-label">Intro Guide</div>
            <h3>WTF is OpenClaw &amp; How to Use It</h3>
            <p className="muted">A fast premium introduction for people who want to understand OpenClaw, build systems, and move into implementation with more clarity.</p>
            <div className="floating-actions">
              <a className="btn btn-primary" href="#guide">DOWNLOAD THE GUIDE</a>
              <a className="btn btn-secondary" href="#book">BOOK A STRATEGY CALL</a>
            </div>
          </div>
        </section>

        <section className="break-section">
          <div className="break-shell">
            <div className="break-label">Strategic Break</div>
            <div className="break-copy">If your business still depends on memory, heroics, and patchwork tools, it is not scaling. It is surviving.</div>
            <p className="break-sub">The right system creates calm, control, and speed. That is what lets execution compound.</p>
          </div>
        </section>

        <section className="section" id="guide">
          <div className="container lead-magnet">
            <div className="guide-panel">
              <span className="eyebrow">Lead Magnet</span>
              <div className="guide-book"><span>Crown Intelligence</span><strong>WTF is OpenClaw &amp; How to Use It</strong></div>
              <h2>Start with the guide if you want to understand OpenClaw properly.</h2>
              <p className="lead">Not everyone should book a call first. Some people need the strategic introduction — a faster way to understand how OpenClaw fits inside real business systems.</p>
              <div className="form-wrap spacer-top">
                <form onSubmit={handleSubmit} className="lead-form">
                  <input className="input" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
                  <input className="input" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                  <input className="input" name="company" placeholder="Company" value={form.company} onChange={handleChange} />
                  <textarea className="input textarea" name="message" placeholder="What are you trying to build?" value={form.message} onChange={handleChange} />
                  <div className="form-actions">
                    <button className="btn btn-primary" type="submit" disabled={status.type === 'loading'}>{status.type === 'loading' ? 'SENDING…' : 'DOWNLOAD THE GUIDE'}</button>
                    <a className="btn btn-secondary" href="#book">BOOK THE CALL INSTEAD</a>
                  </div>
                </form>
                {status.message ? <p className={`form-status ${status.type}`}>{status.message}</p> : null}
              </div>
            </div>

            <aside className="guide-side">
              <span className="eyebrow">Why it matters</span>
              <h3>Learn first. Deploy smarter.</h3>
              <ul className="bullet-list">
                <li>what OpenClaw actually is</li>
                <li>how to think about deployment and use cases</li>
                <li>how to build systems around work and operations</li>
                <li>how to avoid fragmented-tool chaos</li>
              </ul>
              <div className="red-cta-bar spacer-top">
                <p>This is the lower-friction path into the brand for people who want context before commitment.</p>
                <a className="btn btn-secondary" href="#book">BOOK AFTER READING</a>
              </div>
            </aside>
          </div>
        </section>

        <section className="section compact-top" id="why">
          <div className="container split-section reverse">
            <div className="text-col">
              <span className="eyebrow">Why Crown Intelligence</span>
              <h2>This should feel closer to strategic consulting than generic AI agency work.</h2>
              <p className="lead">Crown Intelligence sits at the intersection of systems design, direct-response thinking, and practical deployment.</p>
              <div className="panel spacer-top">
                <ul className="bullet-list">
                  <li>strategic thinking before implementation</li>
                  <li>clean positioning with direct-response intent</li>
                  <li>practical OpenClaw deployment</li>
                  <li>commercial execution over technical theatre</li>
                </ul>
              </div>
            </div>
            <div className="media-col">
              <div className="visual-wide"><div className="visual-core stone" /><div className="visual-core smoke" /><span className="image-kicker">Power / Abstraction</span></div>
            </div>
          </div>
        </section>

        <section className="section compact-top" id="process">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Process</span>
              <h2>Clear diagnosis. Strategic design. Decisive deployment.</h2>
              <p className="lead">Enough structure to feel premium. Enough speed to feel commercially useful.</p>
            </div>
            <div className="steps">
              <div className="step"><div className="step-num">1</div><h3>Diagnose</h3><p>Find friction, weak points, and leverage opportunities.</p></div>
              <div className="step"><div className="step-num">2</div><h3>Design</h3><p>Map workflows, control points, and architecture.</p></div>
              <div className="step"><div className="step-num">3</div><h3>Deploy</h3><p>Implement OpenClaw, automation, and operating systems.</p></div>
              <div className="step"><div className="step-num">4</div><h3>Refine</h3><p>Tighten the machine as the business evolves.</p></div>
            </div>
          </div>
        </section>

        <section className="break-section">
          <div className="break-shell">
            <div className="break-label">Positioning</div>
            <div className="break-copy">The right call is not a sales ritual. It is a strategic intervention.</div>
            <p className="break-sub">Use it to deploy OpenClaw properly, create stronger business systems, improve operations, and move toward your goals faster.</p>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="container faq-grid">
            <div>
              <span className="eyebrow">FAQ</span>
              <h2>Questions, answered.</h2>
              <p className="lead">Short answers. Clear positioning. No unnecessary noise.</p>
            </div>
            <div className="faq-stack">
              <div className="faq-item"><div className="faq-q">Who is this for?</div><p>Founders, agencies, consultants, and service businesses that want AI and OpenClaw tied to real systems and meaningful outcomes.</p></div>
              <div className="faq-item"><div className="faq-q">Should I book a call or start with the guide?</div><p>Start with the guide if you need orientation. Book the session if you already know the business needs stronger systems.</p></div>
              <div className="faq-item"><div className="faq-q">What kind of session is the call?</div><p>It can function as an AI Strategy Call, an OpenClaw Deployment Session, or a Personal Coaching Session focused on systems and execution.</p></div>
            </div>
          </div>
        </section>

        <section className="section" id="book">
          <div className="container">
            <div className="final-panel">
              <h2>Book the session if you want the system to become real.</h2>
              <p>The next step can be an AI Strategy Call, an OpenClaw Deployment Session, or a Personal Coaching Session focused on building stronger systems around your work, business, and goals.</p>
              <p className="red emphasis">Find the bottleneck. Clarify the architecture. Deploy with intent.</p>
              <div className="hero-actions final-actions">
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>BOOK YOUR SESSION</button>
                <a className="btn btn-secondary" href="#guide">GET THE GUIDE FIRST</a>
              </div>
              <div className="final-micro">Premium strategy • system design • OpenClaw deployment</div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-inner">
          <div>CROWN INTELLIGENCE — Strategic Systems For Modern Advantage</div>
          <div>AI strategy • OpenClaw deployment • automation architecture • direct-response execution</div>
        </div>
      </footer>

      <div className="mobile-cta">
        <a className="btn btn-primary" href="#book">BOOK YOUR SESSION</a>
      </div>

      <div className={`modal-overlay ${modalOpen ? 'active' : ''}`} aria-hidden={!modalOpen} onClick={(e) => e.target === e.currentTarget && closeModal()}>
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <button className="modal-close" aria-label="Close" onClick={closeModal}>✕</button>
          <div className="modal-visual"><div className="visual-core king" /></div>
          <div className="modal-copy">
            <span className="eyebrow">OpenClaw Guide</span>
            <h3 id="modalTitle">Before you book, understand what OpenClaw can actually do.</h3>
            <p className="red modal-red">GET THE INTRODUCTION BUILT FOR OPERATORS, NOT SPECTATORS</p>
            <p>Leave your email and get <em>WTF is OpenClaw &amp; How to Use It</em> — the fast strategic guide to deploying OpenClaw for systems, automation, and execution.</p>
            <form onSubmit={handleSubmit} className="modal-form">
              <input className="input" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
              <input className="input" type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
              <textarea className="input textarea" name="message" placeholder="What are you trying to build?" value={form.message} onChange={handleChange} />
              <button className="btn btn-primary" type="submit" disabled={status.type === 'loading'}>{status.type === 'loading' ? 'SENDING…' : 'DOWNLOAD THE GUIDE'}</button>
            </form>
            {status.message ? <p className={`form-status ${status.type}`}>{status.message}</p> : <p className="modal-note">Leads route to eking.pt@gmail.com.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
