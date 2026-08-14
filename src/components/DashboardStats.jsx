import StatsCard from "./StatsCard";

function DashboardStats({
  totalTasks,
  completedTasks,
  inProgressTasks,
  todoTasks,
}) {
  return (
    <div className="stats-grid">
      <StatsCard title="Усього завдань" value={totalTasks} />

      <StatsCard title="Виконано" value={completedTasks} />

      <StatsCard title="У процесі" value={inProgressTasks} />

      <StatsCard title="На сьогодні" value={todoTasks} />
    </div>
  );
}

export default DashboardStats;
