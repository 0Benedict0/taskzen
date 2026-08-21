import { useState, type FormEvent } from "react";

import "../styles/profile/profile-modal.css";
import "../styles/profile/profile-password.css";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordModalProps {
  onClose: () => void;
  onSave: (data: ChangePasswordData) => void | Promise<void>;
}

function ChangePasswordModal({ onClose, onSave }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const passwordsMatch = newPassword === confirmPassword;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!passwordsMatch) {
      return;
    }

    onSave({
      currentPassword,
      newPassword,
    });
  };

  const isSubmitDisabled =
    !currentPassword ||
    !newPassword ||
    !confirmPassword ||
    !passwordsMatch ||
    newPassword.length < 6;

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

            <button type="submit" disabled={isSubmitDisabled}>
              Змінити пароль
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
