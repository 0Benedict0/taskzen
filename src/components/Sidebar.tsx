function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Task<span>Zen</span>
      </div>

      <nav className="sidebar-navigation">
        <a href="/" className="sidebar-link active">
          <span>⌂</span>
          Dashboard
        </a>

        <a href="/" className="sidebar-link">
          <span>✓</span>
          Мої завдання
        </a>

        <a href="/" className="sidebar-link">
          <span>◷</span>
          Календар
        </a>

        <a href="/" className="sidebar-link">
          <span>◈</span>
          Аналітика
        </a>
      </nav>

      <div className="sidebar-bottom">
        <a href="/" className="sidebar-link">
          <span>⚙️</span>
          Налаштування
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;
