import { imageCache, storeAllImages, lastCacheTime } from "./storeAllImages";

// 24 hours in milliseconds
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface ChampionData {
  id: number;
  name: string;
  description: string;
  alias: string;
  contentId: string;
  squarePortraitPath: string;
  roles: string[];
}
export const getAllImages = async (championName: string, imageType: string, championId?: number) => {
  const currentTime = Date.now();

  // If cache is stale or empty, fetch and store images
  if (imageCache.size === 0 || currentTime - lastCacheTime >= CACHE_TTL) {
    await storeAllImages();
  }
    let championJson: ChampionData[];

  if (championId) {
    const response = await fetch("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json");
    championJson = await response.json();
    const championData = championJson.find((champ) => champ.id === championId);
    if (championData) {
      championName = championData.alias.toLowerCase();
    } else {
      console.error(`Champion with ID ${championId} not found in champion summary.`);
    }
  }
  
  let championImages = imageCache.get(championName);

  // Case-insensitive lookup if direct lookup fails
  if (!championImages) {
    const lowerName = championName.toLowerCase();
    for (const [key, val] of imageCache.entries()) {
      if (key.toLowerCase() === lowerName) {
        championImages = val;
        break;
      }
    }
  }

  if (championImages && championImages[imageType]) {
    const dataUri = championImages[imageType];
    const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return {
        contentType: matches[1],
        buffer: Buffer.from(matches[2], "base64"),
      };
    }
  }
  return null;
};
