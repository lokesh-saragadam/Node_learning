// Stats.jsx
const stats = [
  { value: "500+", label: "Problems tracked" },
  { value: "12",   label: "Topic tags" },
  { value: "100%", label: "Free to use" },
];

export default function Stats() {
  return (
    <div className="stats">
      {stats.map((s) => (
        <div key={s.label} className="stat">
          <span className="stat-num">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
