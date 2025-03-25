const getRunes = ( runeId: number) => {
    let tree = "";
    let runeName = "";
  
    switch (runeId) {
      // Domination
      case 8100:
        tree = "Domination";
        runeName = "7200_domination";
        break;
      case 8112:
        tree = "Domination";
        runeName = "Electrocute/Electrocute";
        break;
      case 8128:
        tree = "Domination";
        runeName = "DarkHarvest/DarkHarvest";
        break;
      case 9923:
        tree = "Domination";
        runeName = "HailofBlades/HailofBlades";
        break;
      case 8126:
        tree = "Domination";
        runeName = "CheapShot/CheapShot";
        break;
      case 8139:
        tree = "Domination";
        runeName = "TasteofBlood/TasteofBlood";
        break;
      case 8143:
        tree = "Domination";
        runeName = "SuddenImpact/SuddenImpact";
        break;
      case 8137:
        tree = "Domination";
        runeName = "SixthSense/SixthSense";
        break;
      case 8140:
        tree = "Domination";
        runeName = "GrislyMementos/GrislyMementos";
        break;
      case 8141:
        tree = "Domination";
        runeName = "DeepWard/DeepWard";
        break;
      case 8135:
        tree = "Domination";
        runeName = "TreasureHunter/TreasureHunter";
        break;
      case 8105:
        tree = "Domination";
        runeName = "RelentlessHunter/RelentlessHunter";
        break;
      case 8106:
        tree = "Domination";
        runeName = "UltimateHunter/UltimateHunter";
        break;
  
      // Inspiration
      case 8300:
        tree = "Inspiration";
        runeName = "7203_whimsy";
        break;
      case 8351:
        tree = "Inspiration";
        runeName = "GlacialAugment/GlacialAugment";
        break;
      case 8360:
        tree = "Inspiration";
        runeName = "UnsealedSpellbook/UnsealedSpellbook";
        break;
      case 8369:
        tree = "Inspiration";
        runeName = "FirstStrike/FirstStrike";
        break;
      case 8306:
        tree = "Inspiration";
        runeName = "HextechFlashtraption/HextechFlashtraption";
        break;
      case 8304:
        tree = "Inspiration";
        runeName = "MagicalFootwear/MagicalFootwear";
        break;
      case 8321:
        tree = "Inspiration";
        runeName = "CashBack/CashBack2";
        break;
      case 8313:
        tree = "Inspiration";
        runeName = "PerfectTiming/aclemistcabinet";
        break;
      case 8352:
        tree = "Inspiration";
        runeName = "TimeWarpTonic/TimeWarpTonic";
        break;
      case 8345:
        tree = "Inspiration";
        runeName = "BiscuitDelivery";
        break;
      case 8347:
        tree = "Inspiration";
        runeName = "CosmicInsight/CosmicInsight";
        break;
      case 8410:
        tree = "Inspiration";
        runeName = "ApproachVelocity/ApproachVelocity";
        break;
      case 8316:
        tree = "Inspiration";
        runeName = "JackOfAllTrades/JackOfAllTrades2";
        break;
  
      // Precision
      case 8000:
        tree = "Precision";
        runeName = "7201_precision";
        break;
      case 8005:
        tree = "Precision";
        runeName = "PresstheAttack/PresstheAttack";
        break;
      case 8008:
        tree = "Precision";
        runeName = "LethalTempo/LethalTempo";
        break;
      case 8021:
        tree = "Precision";
        runeName = "FleetFootwork/FleetFootwork";
        break;
      case 8010:
        tree = "Precision";
        runeName = "Conqueror/Conqueror";
        break;
      case 9101:
        tree = "Precision";
        runeName = "AbsorbLife/AbsorbLife";
        break;
      case 9111:
        tree = "Precision";
        runeName = "Triumph";
        break;
      case 8009:
        tree = "Precision";
        runeName = "PresenceofMind/PresenceofMind";
        break;
      case 9104:
        tree = "Precision";
        runeName = "LegendAlacrity/LegendAlacrity";
        break;
      case 9105:
        tree = "Precision";
        runeName = "LegendHaste/LegendHaste";
        break;
      case 9103:
        tree = "Precision";
        runeName = "LegendBloodline/LegendBloodline";
        break;
      case 8014:
        tree = "Precision";
        runeName = "CoupdeGrace/CoupdeGrace";
        break;
      case 8017:
        tree = "Precision";
        runeName = "CutDown/CutDown";
        break;
      case 8299:
        tree = "Precision";
        runeName = "LastStand/LastStand";
        break;
  
      // Resolve
      case 8400:
        tree = "Resolve";
        runeName = "7204_resolve";
        break;
      case 8437:
        tree = "Resolve";
        runeName = "GraspoftheUndying/GraspoftheUndying";
        break;
      case 8439:
        tree = "Resolve";
        runeName = "Aftershock/Aftershock";
        break;
      case 8465:
        tree = "Resolve";
        runeName = "Guardian/Guardian";
        break;
      case 8446:
        tree = "Resolve";
        runeName = "Demolish/Demolish";
        break;
      case 8463:
        tree = "Resolve";
        runeName = "FontofLife/FontofLife";
        break;
      case 8401:
        tree = "Resolve";
        runeName = "ShieldBash/ShieldBash";
        break;
      case 8429:
        tree = "Resolve";
        runeName = "Conditioning/Conditioning";
        break;
      case 8444:
        tree = "Resolve";
        runeName = "SecondWind/SecondWind";
        break;
      case 8473:
        tree = "Resolve";
        runeName = "BonePlating/BonePlating";
        break;
      case 8451:
        tree = "Resolve";
        runeName = "Overgrowth/Overgrowth";
        break;
      case 8453:
        tree = "Resolve";
        runeName = "Revitalize/Revitalize";
        break;
      case 8242:
        tree = "Resolve";
        runeName = "Unflinching/Unflinching";
        break;
  
      // Sorcery
      case 8200:
        tree = "Sorcery";
        runeName = "7202_sorcery";
        break;
      case 8214:
        tree = "Sorcery";
        runeName = "SummonAery/Unflinching";
        break;
      case 8229:
        tree = "Sorcery";
        runeName = "ArcaneComet/ArcaneComet";
        break;
      case 8230:
        tree = "Sorcery";
        runeName = "PhaseRush/PhaseRush";
        break;
      case 8224:
        tree = "Sorcery";
        runeName = "AxiomArcanist/AxiomArcanist";
        break;
      case 8226:
        tree = "Sorcery";
        runeName = "ManaflowBand/ManaflowBand";
        break;
      case 8275:
        tree = "Sorcery";
        runeName = "NimbusCloak/NimbusCloak";
        break;
      case 8210:
        tree = "Sorcery";
        runeName = "Transcendence/Transcendence";
        break;
      case 8234:
        tree = "Sorcery";
        runeName = "Celerity/Celerity";
        break;
      case 8233:
        tree = "Sorcery";
        runeName = "AbsoluteFocus/AbsoluteFocus";
        break;
      case 8237:
        tree = "Sorcery";
        runeName = "Scorch/Scorch";
        break;
      case 8232:
        tree = "Sorcery";
        runeName = "Waterwalking/Waterwalking";
        break;
      case 8236:
        tree = "Sorcery";
        runeName = "GatheringStorm/GatheringStorm";
        break;
  
      default:
        tree = "Unknown";
        runeName = "Unknown";
        break;
    }
    return { tree, runeName };
};
export default getRunes;
