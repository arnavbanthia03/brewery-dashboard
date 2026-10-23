// BreweryCard.jsx — displays ONE brewery. It's reusable: App renders one per item in the array.
export default function BreweryCard({ brewery }) {
  const { name, brewery_type, city, state_province, website_url } = brewery;

  // website_url can be null, so handle that case.
  // Show a cleaner label by removing "https://" and any trailing slash.
  const websiteLabel = website_url
    ? website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;

  return (
    <article className="card">
      <span className="badge">{brewery_type}</span>
      <h3>{name}</h3>
      <p className="card-location">
        {city}, {state_province}
      </p>
      {websiteLabel ? (
        <a href={website_url} target="_blank" rel="noopener noreferrer" className="card-link">
          {websiteLabel}
        </a>
      ) : (
        <span className="card-muted">No website listed</span>
      )}
    </article>
  );
}
