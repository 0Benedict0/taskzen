import type { ChangeEvent } from "react";

type StatusFilter = "all" | "todo" | "in-progress" | "completed";

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;

  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
}

function TaskFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: TaskFiltersProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value as StatusFilter);
  };

  return (
    <div className="tasks-toolbar">
      <input
        type="text"
        className="task-search"
        placeholder="🔍 Пошук завдань..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <select
        className="task-filter"
        value={statusFilter}
        onChange={handleStatusChange}
      >
        <option value="all">Усі</option>

        <option value="todo">Нові</option>

        <option value="in-progress">У процесі</option>

        <option value="completed">Виконані</option>
      </select>
    </div>
  );
}

export default TaskFilters;
