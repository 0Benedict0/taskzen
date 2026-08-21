import { useState } from "react";
import type { FormEvent } from "react";

import "../styles/profile/profile-modal.css";

interface User {
  name: string;
  email: string;
  _id?: string;
}

interface EditProfileModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (userData: User) => void | Promise<void>;
}

function EditProfileModal({ user, onClose, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(user?.name ?? "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

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
            onChange={(event) => setName(event.target.value)}
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
