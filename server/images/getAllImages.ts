import { imageCache, storeAllImages, lastCacheTime } from "./storeAllImages";

// 24 hours in milliseconds
const CACHE_TTL = 24 * 60 * 60 * 1000;

export const getAllImages = async (championName: string, imageType: string) => {
  const currentTime = Date.now();

  // If cache is stale or empty, fetch and store images
  if (imageCache.size === 0 || currentTime - lastCacheTime >= CACHE_TTL) {
    await storeAllImages();
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
        buffer: Buffer.from(matches[2], 'base64')
      };
    }
  }
  return null;
}


