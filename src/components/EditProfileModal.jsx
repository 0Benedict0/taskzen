import { useState } from "react";
import "../styles/profile/profile-modal.css";

function EditProfileModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user?.name || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...user,
      name,
    });
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <h2>Редагувати профіль</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="profile-name">Ім'я</label>

          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="profile-modal-actions">
            <button type="button" onClick={onClose}>
              Скасувати
            </button>

            <button type="submit">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
