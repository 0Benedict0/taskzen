import StatsCard from "./StatsCard";

interface DashboardStatsProps {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
}

function DashboardStats({
  totalTasks,
  completedTasks,
  inProgressTasks,
  todoTasks,
}: DashboardStatsProps) {
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
