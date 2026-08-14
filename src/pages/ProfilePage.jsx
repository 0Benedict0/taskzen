import { useAuth } from "../hooks/useAuth";

import { useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import toast from "react-hot-toast";
import ProfileStars from "../components/profile/ProfileStars";
import DeleteAccountConfirmModal from "../components/DeleteAccountConfirmModal";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();

      toast.success("Акаунт успішно видалено");
    } catch (error) {
      console.error(error);

      toast.error(error.message);
    }
  };
  return (
    <div className="profile-page">
      <ProfileStars />
      <div className="profile-content">
        <h1>Профіль</h1>
        <div className="profile-actions">
          <button
            className="profile-btn primary"
            onClick={() => setIsEditOpen(true)}
          >
            ✏️ Редагувати профіль
          </button>

          <button
            className="profile-btn secondary"
            onClick={() => setIsPasswordOpen(true)}
          >
            🔒 Змінити пароль
          </button>
          <button
            className="profile-btn danger"
            onClick={() => setIsDeleteOpen(true)}
          >
            🗑️ Видалити акаунт
          </button>
        </div>
        <div className="profile-card">
          <div className="profile-avatar">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>

          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>
      {isEditOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditOpen(false)}
          onSave={async (updatedUser) => {
            try {
              await updateProfile(updatedUser);

              toast.success("Профіль успішно оновлено");

              setIsEditOpen(false);
            } catch (error) {
              console.error(error);

              toast.error(error.message);
            }
          }}
        />
      )}
      {isPasswordOpen && (
        <ChangePasswordModal
          onClose={() => setIsPasswordOpen(false)}
          onSave={async (passwordData) => {
            try {
              await changePassword(passwordData);

              toast.success("Пароль успішно змінено");

              setIsPasswordOpen(false);
            } catch (error) {
              console.error(error);

              toast.error(error.message);
            }
          }}
        />
      )}

      {isDeleteOpen && (
        <DeleteAccountConfirmModal
          user={user}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
}

export default ProfilePage;
