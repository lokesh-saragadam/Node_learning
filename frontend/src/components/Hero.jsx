// Hero.jsx
export default function Hero() {
  return (
    <section className="intro">
      <div className="badge">
        <span className="badge-dot" />
        DSA Daily Tracker
      </div>

      <h1 className="title">
        Track your <span className="highlight">DSA & CP</span> journey in one place
      </h1>

      <p className="text">
        Log solved problems, monitor progress, and stay consistent —
        everything you need to ace your next interview.
      </p>

      <div className="actions">
        <button className="btn primary" onClick={() => window.location.href = 'signup'}>
          Sign up free
        </button>
        <button className="btn secondary" onClick={() => window.location.href = 'login'}>
          Log in →
        </button>
      </div>
    </section>
  );
}
