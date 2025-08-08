import { ParticipantDto } from "../../interfaces/MatchV5";

const StatTable = ({ players }: { players: ParticipantDto[] }) => {
  return (
    <div className="overflow-y-scroll no-scrollbar max-h-[50vh]">
      <table className="min-w-full text-sm text-left border-2 border-white rounded-md w-full">
        <thead className="bg-black text-xs text-orange uppercase">
          <tr>
            <th scope="col" className="px-3 py-3">
              Stat
            </th>
            {players.map((player) => (
              <th key={player.riotIdGameName} scope="col" className="px-3 py-3 text-center">
                {player.riotIdGameName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white/80">
          {/* Damage Dealt */}
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Total Damage to Champions</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.totalDamageDealtToChampions}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Physical Damage to Champions</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.physicalDamageDealtToChampions}</td>)}
          </tr>
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Magic Damage to Champions</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.magicDamageDealtToChampions}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">True Damage to Champions</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.trueDamageDealtToChampions}</td>)}
          </tr>
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Total Damage Dealt</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.totalDamageDealt}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Physical Damage Dealt</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.physicalDamageDealt}</td>)}
          </tr>
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Magic Damage Dealt</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.magicDamageDealt}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">True Damage Dealt</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.trueDamageDealt}</td>)}
          </tr>
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Damage To Turrets</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.damageDealtToTurrets}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Damage To Objectives</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.damageDealtToObjectives}</td>)}
          </tr>

          {/* Damage Taken & Healed */}
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Damage Taken</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.totalDamageTaken}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Healing Done</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.totalHeal}</td>)}
          </tr>
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Physical Damage Taken</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.physicalDamageTaken}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Magic Damage Taken</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.magicDamageTaken}</td>)}
          </tr>
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">True Damage Taken</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.trueDamageTaken}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Self Mitigated Damage</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.damageSelfMitigated}</td>)}
          </tr>

          {/* Income */}
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Gold Earned</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.goldEarned}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Gold Spent</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.goldSpent}</td>)}
          </tr>

          {/* Vision */}
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Vision Score</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.visionScore}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Wards Placed</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.wardsPlaced}</td>)}
          </tr>
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Wards Destroyed</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.wardsKilled}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Control Wards Purchased</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.visionWardsBoughtInGame}</td>)}
          </tr>

          {/* Farming */}
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Minions Killed</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.totalMinionsKilled}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Total Jungle Monsters Killed</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.neutralMinionsKilled}</td>)}
          </tr>
          <tr className="border-b bg-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Ally Jungle Monsters</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.totalAllyJungleMinionsKilled}</td>)}
          </tr>
          <tr className="border-b bg-light-gray hover:bg-black transition-colors duration-150">
            <th scope="row" className="  left-0 px-3 py-4 font-bold  whitespace-nowrap text-white">Enemy Jungle Monsters</th>
            {players.map(p => <td key={p.puuid} className="px-3 py-4 text-center">{p.totalEnemyJungleMinionsKilled}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StatTable;