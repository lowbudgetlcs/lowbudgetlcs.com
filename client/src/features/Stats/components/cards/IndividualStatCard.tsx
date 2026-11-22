import { AiOutlineFall, AiOutlineRise } from "react-icons/ai";

interface StatComparison {
  playerValue: number;
  teamAverage: number;
  decimals: number;
  suffix?: string;
  higherIsBetter?: boolean;
}

const IndividualStatCard = ({
  icon,
  iconBgColor,
  title,
  value,
  valueColor,
  comparison,
}: {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  value: string | number;
  valueColor?: string;
  comparison?: StatComparison;
}) => {
  const delta =
    comparison && comparison.teamAverage !== 0
      ? ((comparison.playerValue - comparison.teamAverage) / Math.abs(comparison.teamAverage)) * 100
      : null;
  const deltaColor =
    comparison?.higherIsBetter === undefined || delta === null || delta === 0
      ? "text-text-secondary"
      : (delta > 0) === comparison.higherIsBetter
        ? "text-blue"
        : "text-red";
  const deltaLabel =
    delta === null
      ? "No comparison"
      : delta > 0
        ? `${Math.abs(delta).toFixed(1)}% above team average`
        : delta < 0
          ? `${Math.abs(delta).toFixed(1)}% below team average`
          : "At team average";

  return (
    <article className="flex min-w-0 w-full items-center gap-3 rounded-lg border border-border bg-bg-light/50 p-3">
      <div aria-hidden="true" className={`${iconBgColor} flex size-11 shrink-0 items-center justify-center rounded-lg p-2`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-text-secondary">{title}</p>
        <p className={`mt-0.5 text-2xl font-semibold tabular-nums ${valueColor ?? "text-text-primary"}`}>{value}</p>
        {comparison && (
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
            <span className="text-text-secondary">
              Team avg <span className="font-medium tabular-nums">{comparison.teamAverage.toFixed(comparison.decimals)}{comparison.suffix ?? ""}</span>
            </span>
            <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${deltaColor}`}>
              <span aria-hidden="true" className="inline-flex items-center gap-0.5">
                {delta !== null && delta > 0 ? (
                  <AiOutlineRise className="size-3.5" />
                ) : delta !== null && delta < 0 ? (
                  <AiOutlineFall className="size-3.5" />
                ) : null}
                {delta === null ? "—" : `${Math.abs(delta).toFixed(1)}%`}
              </span>
              <span className="sr-only">{deltaLabel}</span>
            </span>
          </div>
        )}
      </div>
    </article>
  );
};

export default IndividualStatCard;