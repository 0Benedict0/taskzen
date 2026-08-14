function CreateTaskModal({ task, onClose, onCreateTask, onUpdateTask }) {
  const isEditing = Boolean(task);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const taskData = {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      category: formData.get("category"),
    };

    if (isEditing) {
      onUpdateTask({
        ...task,
        ...taskData,
      });
    } else {
      onCreateTask({
        ...taskData,
        status: "todo",
      });
    }
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
              defaultValue={task?.title || ""}
              required
            />
          </label>

          <label>
            Опис
            <textarea
              name="description"
              placeholder="Опишіть завдання..."
              rows="4"
              defaultValue={task?.description || ""}
              required
            />
          </label>

          <div className="form-row">
            <label>
              Пріоритет
              <select name="priority" defaultValue={task?.priority || "medium"}>
                <option value="low">Низький</option>

                <option value="medium">Середній</option>

                <option value="high">Високий</option>
              </select>
            </label>

            <label>
              Категорія
              <select
                name="category"
                defaultValue={task?.category || "frontend"}
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
