// Chart rendering removed — use CSS bars only to avoid extra chart area

const laneOrder = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "SUPPORT"];

const DistributionCard = ({
  title,
  icon,
  iconBgColor,
  data,
  metric = "gold",
}: {
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  data: Record<string, { gold?: number; damage?: number; vision?: number } | { gold: number } | any>;
  metric?: "gold" | "damage" | "vision";
}) => {
  const labels = laneOrder;

  // Turns lane values into an array of numbers
  const values = labels.map((l) => {
    const v = data?.[l];
    if (!v) return 0;
    if (typeof v === "number") return v;
    if (metric && v[metric] !== undefined) return Number(v[metric]);
    if (v.damage !== undefined) return Number(v.damage);
    if (v.gold !== undefined) return Number(v.gold);
    if (v.vision !== undefined) return Number(v.vision);
    return 0;
  });

  return (
    <div className="distributionCard bg-gray/20 border-2 border-gray rounded-md p-4 text-white">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${iconBgColor} p-1 rounded-md flex items-center justify-center`}>{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="laneRows mt-2">
        {labels.map((label, i) => {
          const v = Number(values[i] || 0);
          const display = v.toFixed(1);
          const laneName = label === "SUPPORT" ? "Support" : label.charAt(0) + label.slice(1).toLowerCase();
          return (
            <div key={label} className="mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <div className="text-sm">{laneName}</div>
                <div className="text-sm text-white">{display}%</div>
              </div>
              <div className="w-full bg-white/20 rounded-sm h-4">
                <div
                  className="h-4 rounded-sm bg-white"
                  style={{ width: `${Math.max(0, Math.min(100, v))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default DistributionCard;
