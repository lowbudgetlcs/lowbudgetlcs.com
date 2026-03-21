import { imageCache, storeAllImages, lastCacheTime } from "./storeAllImages";

// 24 hours in milliseconds
const cacheTtl = 24 * 60 * 60 * 1000;

interface ChampionData {
  id: number;
  name: string;
  description: string;
  alias: string;
  contentId: string;
  squarePortraitPath: string;
  roles: string[];
}

let championJson: ChampionData[] | null = null;
let lastCache = 0;
let fetchPromise: Promise<void> | null = null;

export const getAllImages = async (championName: string, imageType: string, championId?: number) => {
  const currentTime = Date.now();

  if (imageCache.size === 0 || currentTime - lastCacheTime >= cacheTtl) {
    await storeAllImages();
    championJson = null;
  }

  if (championId !== undefined) {
    if (!championJson || currentTime - lastCache >= cacheTtl) {
      if (!fetchPromise) {
        fetchPromise = (async () => {
          try {
            const response = await fetch(
              "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json",
            );
            if (response.ok) {
              championJson = await response.json();
              lastCache = Date.now();
            }
          } catch (error) {
            console.error("[Get Images] Failed to fetch champion Json:", error);
          } finally {
            fetchPromise = null;
          }
        })();
      }
      await fetchPromise;
    }

    if (championJson) {
      const championData = championJson.find((champ) => champ.id === championId);
      if (championData) {
        championName = championData.alias;
      } else {
        console.error(`[Get Images] Champion with ID ${championId} not found in champion Json.`);
      }
    }
  }

  let championImages = imageCache.get(championName);

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
