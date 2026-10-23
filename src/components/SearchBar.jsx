// SearchBar.jsx — a "controlled input": React state is the single source of truth
// for what's in the box. The parent passes `value` and `onChange` down as props.
export default function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <label htmlFor="search" className="visually-hidden">
        Search breweries by name
      </label>
      <input
        id="search"
        type="search"
        placeholder="Search by brewery name, e.g. Stone"
        value={value}
        onChange={(e) => onChange(e.target.value)} // tell the parent what was typed
      />
    </div>
  );
}
