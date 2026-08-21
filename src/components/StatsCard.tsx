interface StatsCardProps {
  title: string;
  value: number;
}

function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="stat-card">
      <span>{title}</span>

      <strong>{value}</strong>
    </div>
  );
}

export default StatsCard;
