import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({ task, onStatusChange, onDelete, onEdit, isActionLoading }) {
  const { title, description, priority, category, status, _id } = task;

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id: _id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusLabels = {
    todo: "Нове",
    "in-progress": "У процесі",
    completed: "Виконано",
  };

  const priorityLabels = {
    low: "Низький",
    medium: "Середній",
    high: "Високий",
  };

  return (
    <article ref={setNodeRef} style={style} className="task-card">
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className="task-drag-handle"
      >
        ⋮⋮
      </div>

      <div className="task-card-header">
        <span className="task-status">{statusLabels[status] || status}</span>

        <span className={`task-priority ${priority}`}>
          {priorityLabels[priority] || priority}
        </span>
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="task-card-footer">
        <span className="task-category">{category}</span>

        <div className="task-actions">
          <button
            type="button"
            className="task-edit"
            onClick={onEdit}
            disabled={isActionLoading}
          >
            {isActionLoading ? "..." : "✎"}
          </button>

          <button
            type="button"
            className="task-action"
            onClick={onStatusChange}
            disabled={isActionLoading}
          >
            {isActionLoading ? "..." : "→"}
          </button>

          <button
            type="button"
            className="task-delete"
            onClick={onDelete}
            disabled={isActionLoading}
          >
            {isActionLoading ? "..." : "×"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
