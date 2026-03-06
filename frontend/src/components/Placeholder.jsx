// ─── Shared Placeholder Component ────────────────────────────
// Used by each module until the assigned member implements their pages

export default function Placeholder({ module, member, routes }) {
  return (
    <div>
      <div className="page-header">
        <h1>{module}</h1>
        <p>Assigned to <strong>{member}</strong> — implement your pages in this folder</p>
      </div>
      <div className="card">
        <h2 style={{ fontSize: '0.9rem', marginBottom: 12, color: 'var(--text-secondary)' }}>
          📋 Routes to implement in this module:
        </h2>
        <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
          {routes.map(r => <li key={r}><code style={{ color: 'var(--primary-blue)' }}>{r}</code></li>)}
        </ul>
        <p style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          💡 Use <code>../../services/api.js</code> for all API calls to the backend.
        </p>
      </div>
    </div>
  );
}
