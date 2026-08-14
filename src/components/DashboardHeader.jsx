import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
function DashboardHeader() {
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="dashboard-header">
      <div>
        <p className="dashboard-greeting">Доброго дня 👋</p>

        <h1>{user?.name || "Користувач"}</h1>
      </div>

      <div
        className="dashboard-user"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <div className="dashboard-user" ref={menuRef}>
          <div className="user-avatar">
            {user?.name?.slice(0, 2).toUpperCase() || "U"}
          </div>
          {isMenuOpen && (
            <div className="user-menu">
              <button
                className="user-menu-item"
                onClick={() => navigate("/profile")}
              >
                👤 Профіль
              </button>
              <button
                className="user-menu-item logout"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                🚪 Вийти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
