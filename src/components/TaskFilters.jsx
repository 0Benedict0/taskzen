function TaskFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="tasks-toolbar">
      <input
        type="text"
        className="task-search"
        placeholder="🔍 Пошук завдань..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      <select
        className="task-filter"
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
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
