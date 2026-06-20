// Features.jsx
const features = [
  {
    icon: "📋",
    title: "Problem log",
    desc: "Save every solved problem with notes and difficulty.",
  },
  {
    icon: "📊",
    title: "Progress stats",
    desc: "Visualise streaks and topic-wise coverage over time.",
  },
  {
    icon: "🏷️",
    title: "Smart tags",
    desc: "Filter by trees, DP, graphs and more instantly.",
  },
];

export default function Features() {
  return (
    <>
    <div className="features">
      {features.map((f) => (
        <div key={f.title} className="feature-card">
          <span className="feature-icon">{f.icon}</span>
          <p className="feature-title">{f.title}</p>
          <p className="feature-desc">{f.desc}</p>
        </div>
      ))}
    </div>
    </>
  );
}
