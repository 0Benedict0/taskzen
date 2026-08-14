function DeleteAccountConfirmModal({ user, onClose, onConfirm }) {
  if (!user) {
    return null;
  }

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div
        className="confirm-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-icon">!</div>

        <h2>Видалити акаунт?</h2>

        <p>
          Ви дійсно хочете видалити акаунт
          <strong> «{user.name}»</strong>?
          <br />
          Цю дію неможливо скасувати.
        </p>

        <div className="confirm-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Скасувати
          </button>

          <button
            type="button"
            className="delete-confirm-button"
            onClick={onConfirm}
          >
            Видалити акаунт
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountConfirmModal;
