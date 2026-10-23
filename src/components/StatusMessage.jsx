// StatusMessage.jsx — one component for the three non-data states: loading, error, empty.
// `kind` picks the look; `onAction` + `actionLabel` optionally add a button.
export default function StatusMessage({ kind, title, text, actionLabel, onAction }) {
  return (
    // role="status" / "alert" lets screen readers announce the change.
    <div className={`status status-${kind}`} role={kind === "error" ? "alert" : "status"}>
      {kind === "loading" && <div className="spinner" aria-hidden="true" />}
      <h2>{title}</h2>
      <p>{text}</p>
      {onAction && (
        <button type="button" className="btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
