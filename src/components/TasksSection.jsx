import TaskFilters from "./TaskFilters";
import TaskPagination from "./TaskPagination";
import EmptyTasks from "./EmptyTasks";
import KanbanBoard from "./KanbanBoard";

function TasksSection({
  paginatedTasks,
  onAddTask,
  onStatusChange,
  onDragStatusChange,
  onDelete,
  onEdit,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  currentPage,
  totalPages,
  onPageChange,
  actionTaskId,
}) {
  return (
    <section className="tasks-section">
      <div className="section-heading">
        <div>
          <p className="section-label">Ваш робочий простір</p>
          <h2>Мої завдання</h2>
        </div>

        <button type="button" className="add-task-button" onClick={onAddTask}>
          + Нове завдання
        </button>
      </div>
      <TaskFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      {paginatedTasks.length > 0 ? (
        <KanbanBoard
          tasks={paginatedTasks}
          onStatusChange={onStatusChange}
          onDragStatusChange={onDragStatusChange}
          onDelete={onDelete}
          onEdit={onEdit}
          actionTaskId={actionTaskId}
        />
      ) : (
        <EmptyTasks searchQuery={searchQuery} statusFilter={statusFilter} />
      )}
      <TaskPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}

export default TasksSection;
