export function Topbar({ title }) {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <header className="topbar">
      <h2 className="topbar-title">{title}</h2>
      <div className="topbar-actions">
        <span style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
          {today}
        </span>
      </div>
    </header>
  );
}

