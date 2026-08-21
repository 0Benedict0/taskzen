import { DndContext, closestCorners, useDroppable } from "@dnd-kit/core";

import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import type { Task } from "../services/taskService";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";

import "../styles/KanbanBoard.css";

type TaskStatus = "todo" | "in-progress" | "completed";

interface KanbanColumn {
  id: TaskStatus;
  title: string;
}

interface ColumnProps {
  id: TaskStatus;
  title: string;
  count: number;
  children: React.ReactNode;
}

// Оставлен один актуальный интерфейс, поддерживающий void и Promise<void>
interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (id: string) => void | Promise<void>;
  onDragStatusChange: (
    taskId: string,
    newStatus: TaskStatus,
  ) => void | Promise<void>;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  actionTaskId: string | null;
}

const COLUMNS: KanbanColumn[] = [
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

function getColumnId(
  overId: UniqueIdentifier,
  tasks: Task[],
): TaskStatus | undefined {
  const normalizedId = String(overId);

  if (COLUMN_IDS.includes(normalizedId as TaskStatus)) {
    return normalizedId as TaskStatus;
  }

  const overTask = tasks.find((task) => task._id === normalizedId);

  return overTask?.status;
}

function Column({ id, title, count, children }: ColumnProps) {
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
}: KanbanBoardProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = String(active.id);

    const newStatus = getColumnId(over.id, tasks);

    if (!newStatus) {
      return;
    }

    const currentTask = tasks.find((task) => task._id === taskId);

    if (!currentTask) {
      return;
    }

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
