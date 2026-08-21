import type { FormEvent } from "react";

import type { Task, TaskData } from "../services/taskService";

interface CreateTaskModalProps {
  task: Task | null;
  onClose: () => void;
  onCreateTask: (task: TaskData) => void | Promise<void>;
  onUpdateTask: (task: Task) => void | Promise<void>;
}

function CreateTaskModal({
  task,
  onClose,
  onCreateTask,
  onUpdateTask,
}: CreateTaskModalProps) {
  const isEditing = Boolean(task);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const taskData: TaskData = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      priority: formData.get("priority") as TaskData["priority"],
      category: formData.get("category") as TaskData["category"],
    };

    if (isEditing && task) {
      void onUpdateTask({
        ...task,
        ...taskData,
      });

      return;
    }

    void onCreateTask(taskData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="modal-label">
              {isEditing ? "Редагування" : "Нове завдання"}
            </p>

            <h2>{isEditing ? "Редагувати завдання" : "Створити завдання"}</h2>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            Назва завдання
            <input
              type="text"
              name="title"
              placeholder="Наприклад: Створити API"
              defaultValue={task?.title ?? ""}
              required
            />
          </label>

          <label>
            Опис
            <textarea
              name="description"
              placeholder="Опишіть завдання..."
              rows={4}
              defaultValue={task?.description ?? ""}
              required
            />
          </label>

          <div className="form-row">
            <label>
              Пріоритет
              <select name="priority" defaultValue={task?.priority ?? "medium"}>
                <option value="low">Низький</option>
                <option value="medium">Середній</option>
                <option value="high">Високий</option>
              </select>
            </label>

            <label>
              Категорія
              <select
                name="category"
                defaultValue={task?.category ?? "frontend"}
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="other">Інше</option>
              </select>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Скасувати
            </button>

            <button type="submit" className="submit-button">
              {isEditing ? "Зберегти зміни" : "Створити завдання"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;
