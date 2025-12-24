export const imageCache = new Map<string, any>();
export let lastCacheTime = 0;
let fetchPromise: Promise<void> | null = null;

const fetchAndCreateUrl = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = url.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    return null;
  }
};

export const storeAllImages = async () => {
  if (fetchPromise) {
    return fetchPromise;
  }

  const championData = require("./champions.json");
  
  fetchPromise = (async () => {
    try {
      for (const champ of championData) {
        const name = champ.name;
        if (name === "nothing") continue;
        const lowerCaseName = name.toLowerCase();
        
        const existingImages = imageCache.get(name);

        const splashCenteredUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/base/images/${lowerCaseName}_splash_centered_0.jpg`;
        const splashTileUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/base/images/${lowerCaseName}_splash_tile_0.jpg`;
        const squareUrl = `https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/${name}.png`;

        const [newSplashCentered, newSplashTile, newSquare] = await Promise.all([
          fetchAndCreateUrl(splashCenteredUrl),
          fetchAndCreateUrl(splashTileUrl),
          fetchAndCreateUrl(squareUrl)
        ]);

        const championImageUrls = {
          splashCentered: newSplashCentered || existingImages?.splashCentered,
          splashTile: newSplashTile || existingImages?.splashTile,
          square: newSquare || existingImages?.square,
        };
        imageCache.set(name, championImageUrls);
      }
      lastCacheTime = Date.now();
      console.log("✅ [Image Store] All champion images have been fetched and stored.");
    } catch (error) {
      console.error("Error fetching champion images:", error);
    }
  })();

  return fetchPromise.finally(() => {
    fetchPromise = null;
  });
};
