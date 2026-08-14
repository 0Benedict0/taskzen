import "../styles/components/empty-tasks.css";
function EmptyTasks({ searchQuery, statusFilter }) {
  const hasFilters = searchQuery.trim() !== "" || statusFilter !== "all";

  return (
    <div className="empty-tasks">
      <div className="empty-tasks-icon">✓</div>

      <h3>{hasFilters ? "Завдань не знайдено" : "У вас поки немає завдань"}</h3>

      <p>
        {hasFilters
          ? "Спробуйте змінити пошук або фільтр."
          : "Створіть своє перше завдання, щоб почати роботу."}
      </p>
    </div>
  );
}

export default EmptyTasks;
