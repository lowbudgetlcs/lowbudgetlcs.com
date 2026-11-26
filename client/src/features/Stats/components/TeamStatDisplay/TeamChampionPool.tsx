import type { ChampionPoolRole, TeamChampionStat, TeamOverallStats } from "../../../../types/StatTypes";
import topIcon from "../../../../assets/laneIcons/topIcon.svg";
import jungleIcon from "../../../../assets/laneIcons/jungleIcon.svg";
import middleIcon from "../../../../assets/laneIcons/middleIcon.svg";
import bottomIcon from "../../../../assets/laneIcons/bottomIcon.svg";
import supportIcon from "../../../../assets/laneIcons/supportIcon.svg";

const roles: { key: ChampionPoolRole; label: string; icon: string }[] = [
  { key: "TOP", label: "Top", icon: topIcon },
  { key: "JUNGLE", label: "Jungle", icon: jungleIcon },
  { key: "MIDDLE", label: "Mid", icon: middleIcon },
  { key: "BOTTOM", label: "Bot", icon: bottomIcon },
  { key: "SUPPORT", label: "Support", icon: supportIcon },
];

const ChampionRow = ({ champion }: { champion: TeamChampionStat }) => (
  <li className="flex min-w-0 items-center gap-2 rounded-md bg-bg-dark/60 px-1.5 py-1">
    <img
      src={`${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${champion.championName}/square`}
      width={28}
      height={28}
      alt=""
      className="size-7 shrink-0 rounded"
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm leading-tight">{champion.championName}</p>
      <p className="text-[11px] text-text-secondary">
        {champion.games} games · {champion.kda.toFixed(1)} KDA
      </p>
    </div>
    <p
      className={`shrink-0 text-xs font-semibold tabular-nums ${champion.winrate >= 50 ? "text-blue" : "text-red"}`}
      title={`${champion.wins} wins`}>
      {champion.winrate.toFixed(0)}%
    </p>
  </li>
);

const ChampionRows = ({ champions }: { champions: TeamChampionStat[] }) => {
  const visibleChampions = champions.slice(0, 5);
  const remainingChampions = champions.slice(5);

  return (
    <>
      <ul className="mt-2 flex flex-col gap-1">
        {visibleChampions.map((champion) => (
          <ChampionRow key={champion.championName} champion={champion} />
        ))}
      </ul>
      {remainingChampions.length > 0 && (
        <details className="mt-1">
          <summary className="cursor-pointer px-1 py-1 text-xs text-text-secondary">
            Show {remainingChampions.length} more champions
          </summary>
          <ul className="mt-1 flex flex-col gap-1">
            {remainingChampions.map((champion) => (
              <ChampionRow key={champion.championName} champion={champion} />
            ))}
          </ul>
        </details>
      )}
    </>
  );
};

const TeamChampionPool = ({ teamData }: { teamData: TeamOverallStats }) => {
  const playerPools = teamData.championPoolByPlayer ?? [];

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold">Champion Pool</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Champion picks across {teamData.totalGames} team games.
        </p>
      </div>

      <section>
        <h3 className="mb-2 border-b border-border pb-1 text-base font-semibold">Players by Role</h3>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {roles.map(({ key, label, icon }) => {
            const players = playerPools.filter((player) => (player.roles ?? []).includes(key));
            return (
              <li key={key} className="min-w-0 rounded-lg border border-border bg-bg-light/50 p-2">
                <div className="flex items-center gap-1.5">
                  <img src={icon} width={20} height={20} alt="" className="size-5 shrink-0 light:brightness-25" />
                  <h4 className="text-sm font-semibold">{label}</h4>
                </div>
                {players.length > 0 ? (
                  <ul className="mt-1 flex flex-col gap-0.5">
                    {players.map((player) => (
                      <li key={player.playerKey} className="truncate text-xs text-text-secondary">
                        {player.playerName}{player.tagLine ? ` #${player.tagLine}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-text-secondary">No role data</p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 border-b border-border pb-1 text-base font-semibold">Champions by Role</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {roles.map(({ key, label, icon }) => {
            const champions = teamData.championPoolByRole?.[key] ?? [];
            return (
              <article key={key} className="min-w-0 rounded-lg border border-border bg-bg-light/50 p-2">
                <div className="flex items-center gap-1.5">
                  <img src={icon} width={20} height={20} alt="" className="size-5 shrink-0 light:brightness-25" />
                  <h4 className="text-sm font-semibold">{label}</h4>
                </div>
                {champions.length > 0 ? (
                  <ChampionRows champions={champions} />
                ) : (
                  <p className="mt-2 text-xs text-text-secondary">No champion data</p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-2 border-b border-border pb-1 text-base font-semibold">Champions by Player</h3>
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          {playerPools.map((player) => (
            <details key={player.playerKey} className="min-w-0 rounded-lg border border-border bg-bg-light/50 p-2">
              <summary className="cursor-pointer font-semibold">
                <span className="inline-flex max-w-full items-center gap-2 align-middle">
                  <span className="flex shrink-0 items-center gap-1">
                    {(player.roles ?? []).map((role) => {
                      const roleDetails = roles.find((entry) => entry.key === role);
                      return roleDetails ? (
                        <img
                          key={role}
                          src={roleDetails.icon}
                          width={18}
                          height={18}
                          alt={roleDetails.label}
                          className="size-4.5 light:brightness-25"
                        />
                      ) : null;
                    })}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm inline-flex align-middle">
                    {player.playerName}{player.tagLine ? ` #${player.tagLine}` : ""}
                  </span>
                </span>
              </summary>
              <ChampionRows champions={player.champions} />
            </details>
          ))}
          {playerPools.length === 0 && <p className="text-sm text-text-secondary">No player champion data available.</p>}
        </div>
      </section>
    </section>
  );
};

export default TeamChampionPool;
