// Footer.jsx — a small footer shown at the bottom of the dashboard.
// It has its own CSS file (Footer.css) so it does not touch index.css.
import "./Footer.css";

const TEAM = ["Arnav Banthia", "Dhanraj Haria", "Shaurya Lalwani", "Sarthakk Mukherji"];

export default function Footer() {
  return (
    <footer className="footer">
      <p>Built by {TEAM.join(", ")}.</p>
      <p>
        Data from{" "}
        <a href="https://www.openbrewerydb.org" target="_blank" rel="noopener noreferrer">
          Open Brewery DB
        </a>
        .
      </p>
    </footer>
  );
}
