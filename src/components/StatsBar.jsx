// StatsBar.jsx — a row of small summary numbers computed from the fetched breweries.
// It receives the `breweries` array as a prop and calculates everything itself.
import "./StatsBar.css";

export default function StatsBar({ breweries }) {
  // new Set(...) removes duplicates, and .size counts what is left.
  const cities = new Set(breweries.map((b) => b.city)).size;
  const countries = new Set(breweries.map((b) => b.country)).size;

  // Count how many breweries there are of each type, then pick the biggest.
  const counts = {};
  breweries.forEach((b) => {
    counts[b.brewery_type] = (counts[b.brewery_type] || 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const mostCommonType = top ? top[0] : "-";

  const stats = [
    { label: "Breweries", value: breweries.length },
    { label: "Cities", value: cities },
    { label: "Countries", value: countries },
    { label: "Most common type", value: mostCommonType },
  ];

  return (
    <section className="stats" aria-label="Summary statistics">
      {stats.map((stat) => (
        <div className="stat" key={stat.label}>
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
