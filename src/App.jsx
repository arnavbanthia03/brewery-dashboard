// App.jsx — the "brain" of the dashboard.
// It owns ALL the state, talks to the API, and passes data down to child components via props.
import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import BreweryCard from "./components/BreweryCard";
import TypeChart from "./components/TypeChart";
import StatusMessage from "./components/StatusMessage";
import Footer from "./components/Footer";
import StatsBar from "./components/StatsBar";

const API_URL = "https://api.openbrewerydb.org/v1/breweries";
const PER_PAGE = 50; // how many breweries we ask the API for at once

export default function App() {
  // ---------- STATE ----------
  // Each useState returns [currentValue, functionToChangeIt].
  // Changing a value with its setter makes React re-render the component.
  const [breweries, setBreweries] = useState([]);      // the data from the API
  const [loading, setLoading] = useState(true);        // true while a request is in flight
  const [error, setError] = useState(null);            // holds an error message if the request fails
  const [searchTerm, setSearchTerm] = useState("");    // what the user is typing right now
  const [debouncedTerm, setDebouncedTerm] = useState(""); // the term we actually send to the API
  const [retryCount, setRetryCount] = useState(0);     // bumping this re-runs the fetch effect

  // ---------- EFFECT 1: debounce the search box ----------
  // We don't want to call the API on every single keystroke. Instead we wait
  // 400ms after the user stops typing, then copy searchTerm into debouncedTerm.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 400);

    // Cleanup: if searchTerm changes again before 400ms, cancel the old timer.
    return () => clearTimeout(timer);
  }, [searchTerm]); // dependency array: re-run this effect whenever searchTerm changes

  // ---------- EFFECT 2: fetch data from the API ----------
  // Runs on first render, and again whenever debouncedTerm or retryCount changes.
  useEffect(() => {
    // AbortController lets us cancel an old request if a new one starts,
    // so a slow, outdated response can never overwrite newer results.
    const controller = new AbortController();

    async function fetchBreweries() {
      setLoading(true); // 1. show the loading UI
      setError(null);   // 2. clear any old error

      try {
        // Build the URL, e.g. ...?per_page=50&by_name=dog
        const params = new URLSearchParams({ per_page: PER_PAGE });
        if (debouncedTerm) params.set("by_name", debouncedTerm);

        const response = await fetch(`${API_URL}?${params}`, {
          signal: controller.signal,
        });

        // fetch() only throws on network failure, NOT on 404/500 — so check manually.
        if (!response.ok) {
          throw new Error(`The API responded with status ${response.status}.`);
        }

        const data = await response.json();
        setBreweries(data); // 3. save results -> React re-renders with the new data
      } catch (err) {
        if (err.name === "AbortError") return; // we cancelled it ourselves; not a real error
        setBreweries([]);
        setError(
          err instanceof TypeError
            ? "Couldn't reach the server. Check your internet connection and try again."
            : err.message
        );
      } finally {
        // Runs whether the request succeeded or failed: stop the loading UI.
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchBreweries();

    // Cleanup: runs before the next effect, or when the component unmounts.
    return () => controller.abort();
  }, [debouncedTerm, retryCount]);

  // ---------- RENDER ----------
  // Decide which "view" to show. Order matters: loading -> error -> empty -> data.
  function renderContent() {
    if (loading) {
      return <StatusMessage kind="loading" title="Pouring results…" text="Fetching breweries from the API." />;
    }

    if (error) {
      return (
        <StatusMessage
          kind="error"
          title="We couldn't load breweries"
          text={error}
          actionLabel="Try again"
          onAction={() => setRetryCount((n) => n + 1)}
        />
      );
    }

    if (breweries.length === 0) {
      return (
        <StatusMessage
          kind="empty"
          title={`No breweries match "${debouncedTerm}"`}
          text="Check the spelling or try a shorter name."
          actionLabel="Clear search"
          onAction={() => setSearchTerm("")}
        />
      );
    }

    // Happy path: we have data.
    return (
      <>
        <StatsBar breweries={breweries} />
        <TypeChart breweries={breweries} />
        <h2 className="section-title">
          {breweries.length} {breweries.length === 1 ? "brewery" : "breweries"}
        </h2>
        <div className="grid">
          {breweries.map((brewery) => (
            <BreweryCard key={brewery.id} brewery={brewery} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Brewery Dashboard</h1>
        <p>Search breweries across the World and see what kinds you find.</p>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </header>
      <main>{renderContent()}</main>
      <Footer />
    </div>
  );
}
