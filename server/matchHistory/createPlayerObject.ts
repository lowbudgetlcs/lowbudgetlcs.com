import { MatchV5DTOs } from "twisted/dist/models-dto";
import PlayerStats from "./interfaces/PlayerStats";

const createPlayerObject = (
  teamId: number,
  matchData: MatchV5DTOs.MatchDto
) => {
  const playerList: PlayerStats[] = [];
  const rawPlayers = matchData.info.participants.filter(
    (player) => player.teamId === teamId
  );

  rawPlayers.forEach((player) => {
    const { statPerks, styles } = player.perks;
    const playerObject: PlayerStats = {
      playerName: player.riotIdGameName + "#" + player.riotIdTagline,
      puuid: player.puuid,
      championName: player.championName,
      championId: player.championId,
      teamPosition: player.teamPosition,
      champLevel: player.champLevel,
      runes: [
        {
          statPerks: {
            defense: statPerks.defense,
            flex: statPerks.flex,
            offense: statPerks.offense,
          },
          styles: styles,
        },
      ],
      items: [
        player.item0,
        player.item1,
        player.item2,
        player.item3,
        player.item4,
        player.item5,
        player.item6,
      ],
      summonerSpells: {
        summoner1Id: player.summoner1Id,
        summoner2Id: player.summoner2Id,
      },
      kills: player.kills,
      deaths: player.deaths,
      assists: player.assists,
      damageToChampions: player.totalDamageDealtToChampions,
      damageTaken: player.totalDamageTaken,
      totalHeal: player.totalHeal,
      totalHealsOnTeammates: player.totalHealsOnTeammates,
      visionScore: player.visionScore,
      constrolWards: player.sightWardsBoughtInGame,
      goldEarned: player.goldEarned,
      cs: player.totalMinionsKilled,
      pings: {
        allInPings: player.allInPings,
        assistMePings: player.assistMePings,
        basicPings: player.basicPings,
        commandPings: player.commandPings,
        dangerPings: player.dangerPings,
        enemyMissingPings: player.enemyMissingPings,
        enemyVisionPings: player.enemyVisionPings,
        getBackPings: player.getBackPings,
        holdPings: player.holdPings,
        needVisionPings: player.needVisionPings,
        onMyWayPings: player.onMyWayPings,
        pushPings: player.pushPings,
        retreatPings: player.retreatPings,
        visionClearedPings: player.visionClearedPings,
      },
    };
    playerList.push(playerObject);
  });
  return playerList;
};

export default createPlayerObject;
