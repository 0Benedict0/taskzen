import { useState } from "react";
import "../styles/profile/profile-modal.css";
import "../styles/profile/profile-password.css";

function ChangePasswordModal({ onClose, onSave }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch = newPassword === confirmPassword;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!passwordsMatch) {
      return;
    }

    onSave({
      currentPassword,
      newPassword,
    });
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <h2>Змінити пароль</h2>

        <form className="profile-password-form" onSubmit={handleSubmit}>
          <label htmlFor="current-password">
            Поточний пароль
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Введіть поточний пароль"
              required
            />
          </label>

          <label htmlFor="new-password">
            Новий пароль
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Мінімум 6 символів"
              minLength={6}
              required
            />
          </label>

          <label htmlFor="confirm-password">
            Підтвердження нового пароля
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Повторіть новий пароль"
              required
            />
          </label>

          {confirmPassword && !passwordsMatch && (
            <p className="profile-password-error">Паролі не співпадають</p>
          )}

          <div className="profile-password-actions">
            <button type="button" onClick={onClose}>
              Скасувати
            </button>

            <button
              type="submit"
              disabled={
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                !passwordsMatch ||
                newPassword.length < 6
              }
            >
              Змінити пароль
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
