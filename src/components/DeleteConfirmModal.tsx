import type { Task } from "../services/taskService";

interface DeleteConfirmModalProps {
  task: Task | null;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({
  task,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!task) {
    return null;
  }

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div
        className="confirm-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-icon">!</div>

        <h2>Видалити завдання?</h2>

        <p>
          Ви дійсно хочете видалити
          <strong> «{task.title}»</strong>?
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
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
