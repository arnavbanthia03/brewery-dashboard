// FilteredGrid.jsx — a dropdown that filters the brewery cards by brewery_type.
// It keeps its OWN state (the selected type), so App.jsx stays simple.
import { useState } from "react";
import BreweryCard from "./BreweryCard";
import "./FilteredGrid.css";

export default function FilteredGrid({ breweries }) {
  // "all" means no filter. This state changes when the user picks an option.
  const [selectedType, setSelectedType] = useState("all");

  // Build the dropdown options from the data: unique types, sorted A to Z.
  const types = [...new Set(breweries.map((b) => b.brewery_type))].sort();

  // If new search results do not contain the chosen type any more, fall back to "all".
  const activeType = types.includes(selectedType) ? selectedType : "all";

  // Keep only the breweries that match the chosen type.
  const visible =
    activeType === "all"
      ? breweries
      : breweries.filter((b) => b.brewery_type === activeType);

  return (
    <>
      <div className="filter">
        <label htmlFor="type-filter">Filter by type</label>
        <select
          id="type-filter"
          value={activeType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <span className="filter-count">
          Showing {visible.length} of {breweries.length}
        </span>
      </div>

      <div className="grid">
        {visible.map((brewery) => (
          <BreweryCard key={brewery.id} brewery={brewery} />
        ))}
      </div>
    </>
  );
}
