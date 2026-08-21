import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function DashboardHeader() {
  const { user, logout } = useAuth();

  const menuRef = useRef<HTMLDivElement | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitials = user?.name?.slice(0, 2).toUpperCase() || "U";

  return (
    <header className="dashboard-header">
      <div>
        <p className="dashboard-greeting">Доброго дня 👋</p>

        <h1>{user?.name || "Користувач"}</h1>
      </div>

      <div className="dashboard-user" ref={menuRef}>
        <button
          type="button"
          className="dashboard-user-button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <div className="user-avatar">{userInitials}</div>
        </button>

        {isMenuOpen && (
          <div className="user-menu">
            <button
              type="button"
              className="user-menu-item"
              onClick={handleProfileClick}
            >
              👤 Профіль
            </button>

            <button
              type="button"
              className="user-menu-item logout"
              onClick={handleLogout}
            >
              🚪 Вийти
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default DashboardHeader;
