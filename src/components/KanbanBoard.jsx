import { DndContext, closestCorners, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";

import "../styles/KanbanBoard.css";

const COLUMNS = [
  {
    id: "todo",
    title: "Нові завдання",
  },
  {
    id: "in-progress",
    title: "Виконується",
  },
  {
    id: "completed",
    title: "Завершені",
  },
];

const COLUMN_IDS = COLUMNS.map((column) => column.id);

function getColumnId(overId, tasks) {
  if (COLUMN_IDS.includes(overId)) {
    return overId;
  }

  const overTask = tasks.find((task) => task._id === overId);

  return overTask?.status;
}

function Column({ id, title, count, children }) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="kanban-column">
      <div className="kanban-header">
        <h3>{title}</h3>

        <span>{count}</span>
      </div>

      {children}
    </div>
  );
}

function KanbanBoard({
  tasks,
  onStatusChange,
  onDragStatusChange,
  onDelete,
  onEdit,
  actionTaskId,
}) {
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;

    const newStatus = getColumnId(over.id, tasks);

    if (!newStatus) return;

    const currentTask = tasks.find((task) => task._id === taskId);

    if (!currentTask) return;

    if (currentTask.status === newStatus) {
      return;
    }

    onDragStatusChange(taskId, newStatus);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);

          return (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              count={columnTasks.length}
            >
              <SortableContext
                items={columnTasks.map((task) => task._id)}
                strategy={verticalListSortingStrategy}
              >
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={() => onStatusChange(task._id)}
                    onDelete={() => onDelete(task)}
                    onEdit={() => onEdit(task)}
                    isActionLoading={actionTaskId === task._id}
                  />
                ))}
              </SortableContext>
            </Column>
          );
        })}
      </div>
    </DndContext>
  );
}

export default KanbanBoard;
