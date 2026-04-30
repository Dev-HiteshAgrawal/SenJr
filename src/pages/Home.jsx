import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import './Home.css';

// ─── Data ─────────────────────────────────────────

const STATS = [
  { value: '2,400', suffix: '+', label: 'Students Learning' },
  { value: '800',   suffix: '+', label: 'Verified Mentors'  },
  { value: '15K',   suffix: '+', label: 'Sessions Completed'},
  { value: '4.9',   suffix: ' ⭐', label: 'Average Rating'  },
];

const STEPS = [
  {
    icon: '🔍',
    num: '01',
    title: 'Find Your Senior',
    desc: 'Browse mentors from IIT, DU, VIT, BITS, MIT & more. Filter by college, stream, or subject.',
  },
  {
    icon: '📅',
    num: '02',
    title: 'Book a Session',
    desc: 'Pick a time that works for you. Sessions are 1-on-1, focused, and 100% personalised.',
  },
  {
    icon: '🚀',
    num: '03',
    title: 'Learn & Level Up',
    desc: 'Get real guidance, complete homework, earn badges, and track your progress daily.',
  },
];

const FEATURES = [
  {
    icon: '🎯',
    tag: 'Personalised',
    title: 'Just You & Your Mentor',
    desc: `No 500-student classrooms. Every session is 1-on-1 — your questions, your pace, your goals. Your mentor’s full attention, every time.`,
  },
  {
    icon: '✅',
    tag: 'Verified',
    title: 'Seniors Who Actually Did It',
    desc: `Every mentor is a verified senior from a top college — 1 to 3 years ahead of you. They know exactly what you’re going through because they just did it.`,
  },
  {
    icon: '🤖',
    tag: 'AI-Powered',
    title: 'AI Tutor Available 24/7',
    desc: `Stuck at 2 AM before your exam? Our AI Tutor is always on — explain concepts, quiz you, and help you revise for JEE, NEET, CUET or finals anytime.`,
  },
  {
    icon: '📚',
    tag: 'Free',
    title: 'Free Courses by Real Students',
    desc: `Curated free courses built by seniors who aced the same exams. No paywalls on the essentials — quality learning should be accessible to all.`,
  },
];

const FOOTER_LINKS = {
  Platform: [
    { label: 'Find a Mentor',  to: '/find-mentors'  },
    { label: 'Free Courses',   to: '/free-courses'  },
    { label: 'AI Tutor',       to: '/ai-tutor'      },
    { label: 'Leaderboard',    to: '/leaderboard'   },
    { label: 'Community',      to: '/community'     },
  ],
  Mentors: [
    { label: 'Become a Mentor',    to: '/signup'         },
    { label: 'Mentor Dashboard',   to: '/mentor-dashboard'},
    { label: 'Mentor Guidelines',  to: '/'               },
    { label: 'Success Stories',    to: '/'               },
  ],
  Company: [
    { label: 'About Us',       to: '/' },
    { label: 'Blog',           to: '/' },
    { label: 'Careers',        to: '/' },
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Use',   to: '/' },
  ],
};

// ─── Component ────────────────────────────────────

export default function Home() {
  return (
    <main>

      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section className="hero" aria-label="Hero">
        <ParticleBackground />
        <div className="hero-inner">

          {/* Pill */}
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            Now live — Free 1-on-1 sessions for JEE, NEET &amp; global aspirants
          </div>

          {/* Heading */}
          <h1 className="hero-heading">
            Learn from those who<br />
            <span className="highlight">just did it 🚀</span>
          </h1>

          {/* Sub */}
          <p className="hero-sub">
            Connect with real seniors from IIT, DU, VIT, BITS, MIT &amp; Oxford who are
            1–3 years ahead of you. Real advice. Real experience. Real results.
          </p>

          {/* College badges */}
          <div className="hero-badges" aria-label="Featured colleges">
            {['🏛️ IIT Delhi', '📖 DU', '⚙️ VIT', '🔬 BITS', '🎓 MIT', '💡 Oxford'].map((b) => (
              <span key={b} className="hero-badge">{b}</span>
            ))}
          </div>

          {/* CTAs */}
          <div className="hero-ctas">
            <Link to="/signup" state={{ role: 'student' }} className="btn-primary" id="hero-join-student">
              <span>🎓</span>
              <span>Join as Student</span>
            </Link>
            <Link to="/signup" state={{ role: 'mentor' }} className="btn-secondary" id="hero-become-mentor">
              <span>✨</span>
              <span>Become a Mentor</span>
            </Link>
          </div>

          {/* Social proof */}
          <div className="hero-social-proof">
            <div className="avatar-stack" aria-hidden="true">
              {['👦', '👧', '🧑', '👩', '🧒'].map((e, i) => (
                <div key={i} className="avatar-stack-item">{e}</div>
              ))}
            </div>
            <p className="social-proof-text">
              Joined by <strong>2,400+ students</strong> this month
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. STATS BAR
      ══════════════════════════════════════════ */}
      <section className="stats-bar" aria-label="Platform statistics">
        <div className="stats-bar-inner">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">
                {s.value}
                <span className="stat-accent">{s.suffix}</span>
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="section how-it-works" aria-labelledby="hiw-heading">
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <div className="section-tag">⚡ How It Works</div>
          <h2 className="section-heading" id="hiw-heading">
            From lost to level up<br />in 3 simple steps
          </h2>
          <p className="section-subheading" style={{ margin: '0 auto' }}>
            No complicated process. Find your mentor, book your session,
            and start growing — all in minutes.
          </p>

          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number-wrap">
                  <div className="step-number-bg" />
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-num-badge">{i + 1}</div>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. WHY SENJR
      ══════════════════════════════════════════ */}
      <section className="section why-senJr" aria-labelledby="why-heading">
        <div className="section-inner">
          <div style={{ maxWidth: 600 }}>
            <div className="section-tag">💡 Why Senjr</div>
            <h2 className="section-heading" id="why-heading">
              Not just another<br />learning platform
            </h2>
            <p className="section-subheading">
              We built exactly what we wished existed when we were students —
              real seniors, real guidance, zero fluff.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon-wrap" aria-hidden="true">
                  {f.icon}
                </div>
                <div>
                  <div className="feature-tag">{f.tag}</div>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. FOOTER
      ══════════════════════════════════════════ */}
      <footer className="footer" role="contentinfo">
        <div className="footer-inner">

          {/* Brand col */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              Sen<span>jr</span> ⚡
            </Link>
            <p className="footer-tagline">
              Peer-to-peer mentorship connecting students with seniors
              from India's top colleges &amp; global universities. Learn from those who just did it.
            </p>
            <div className="footer-socials">
              {[
                { icon: '𝕏', label: 'Twitter' },
                { icon: '💼', label: 'LinkedIn' },
                { icon: '📸', label: 'Instagram' },
                { icon: '▶️', label: 'YouTube' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="/"
                  className="footer-social-btn"
                  aria-label={s.label}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(FOOTER_LINKS).map(([col, links]) => (
            <div key={col}>
              <div className="footer-col-title">{col}</div>
              <nav className="footer-links" aria-label={`${col} links`}>
                {links.map((l) => (
                  <Link key={l.label} to={l.to} className="footer-link">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Senjr. All rights reserved.
          </p>
          <p className="footer-made">
            Made with <span className="heart">❤️</span> in India &amp; beyond 🇮🇳🌍
          </p>
        </div>
      </footer>

    </main>
  );
}
