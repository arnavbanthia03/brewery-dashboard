// Footer.jsx — a small footer shown at the bottom of the dashboard.
// It has its own CSS file (Footer.css) so it does not touch index.css.
import "./Footer.css";

// TODO (Friend 1): replace the three placeholder names with the real team names.
const TEAM = ["Arnav Banthia", "Friend 1 Name", "Friend 2 Name", "Friend 3 Name"];

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
