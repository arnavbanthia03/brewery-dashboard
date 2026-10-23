// TypeChart.jsx — bar chart of how many breweries exist per brewery_type.
// It receives the fetched array as a prop and computes the counts itself.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TypeChart({ breweries }) {
  // Turn [{brewery_type:"micro"}, {brewery_type:"micro"}, {brewery_type:"brewpub"}]
  // into { micro: 2, brewpub: 1 } ...
  const counts = breweries.reduce((acc, b) => {
    acc[b.brewery_type] = (acc[b.brewery_type] || 0) + 1;
    return acc;
  }, {});

  // ...then into [{type:"micro", count:2}, ...] (what Recharts expects), biggest first.
  const data = Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const height = Math.max(200, data.length * 40); // grow with the number of bars

  return (
    <section className="chart-panel" aria-label="Breweries by type">
      <h2>Breweries by type</h2>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.3)" />
            <XAxis type="number" allowDecimals={false} tick={{ fill: "#fff" }} stroke="#fff" />
            <YAxis type="category" dataKey="type" width={90} tick={{ fill: "#fff" }} stroke="#fff" />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.15)" }}
              contentStyle={{ background: "#fff", border: "none", borderRadius: 8, color: "#9A3B00" }}
            />
            <Bar dataKey="count" name="Breweries" fill="#fff" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
