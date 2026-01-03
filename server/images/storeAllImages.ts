interface ChampionData {
  id: number;
  name: string;
  description: string;
  alias: string;
  contentId: string;
  squarePortraitPath: string;
  roles: string[];
}

export const imageCache = new Map<string, any>();
export let lastCacheTime = 0;
let fetchPromise: Promise<void> | null = null;

const fetchAndCreateUrl = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const mimeType = url.endsWith(".jpg") ? "image/jpeg" : "image/png";
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    return null;
  }
};

export const storeAllImages = async () => {
  if (fetchPromise) {
    return fetchPromise;
  }

  const championData = async () => {
    try {
      const response = await fetch(
        "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch champion data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching champion data:", error);
      return [];
    }
  };
  const championDataJson: ChampionData[] = await championData();
  if (!championDataJson || championDataJson.length === 0) {
    console.error("Failed to fetch champion data from JSON");
    return;
  }

  fetchPromise = (async () => {
    try {
      for (const champ of championDataJson) {
        // Remove None champion
        const { id, alias } = champ;
        if (id === -1) continue;
        const lowerCaseName = alias.toLowerCase();
        const existingImages = imageCache.get(alias);

        const splashCenteredUrlBase = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/base/images/${lowerCaseName}_splash_centered_0.jpg`;
        const splashCenteredUrlSkin0 = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/skin0/images/${lowerCaseName}_splash_centered_0.jpg`;
        const splashCenteredUrlBaseWithExtraNameOnImage = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/base/images/${lowerCaseName}_splash_centered_0.${lowerCaseName}.jpg`;

        const splashTileUrlBase = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/base/images/${lowerCaseName}_splash_tile_0.jpg`;
        const splashTileUrlSkin0 = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/skin0/images/${lowerCaseName}_splash_tile_0.jpg`;
        const splashTileUrlBaseWithExtraNameOnImage = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/base/images/${lowerCaseName}_splash_tile_0.${lowerCaseName}.jpg`;

        
        const portraitUrlBase = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/base/${lowerCaseName}loadscreen.jpg`;
        const portraitUrlBaseWith0 = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/base/${lowerCaseName}loadscreen_0.jpg`;
        const portraitUrlSkin0 = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/skin0/${lowerCaseName}loadscreen.jpg`;
        const portraitUrlBaseWithExtraNameOnImage = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${lowerCaseName}/skins/base/${lowerCaseName}loadscreen_0.${lowerCaseName}.jpg`;


        const squareUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${id}.png`;

        const [newSplashCentered, newSplashTile, newSquare, newPortrait] = await Promise.all([
          fetchAndCreateUrl(splashCenteredUrlBase).then((res) => res || fetchAndCreateUrl(splashCenteredUrlSkin0)).then((res) => res || fetchAndCreateUrl(splashCenteredUrlBaseWithExtraNameOnImage)),
          fetchAndCreateUrl(splashTileUrlBase).then((res) => res || fetchAndCreateUrl(splashTileUrlSkin0)).then((res) => res || fetchAndCreateUrl(splashTileUrlBaseWithExtraNameOnImage)),
          fetchAndCreateUrl(squareUrl),
          fetchAndCreateUrl(portraitUrlBase).then((res) => res || fetchAndCreateUrl(portraitUrlSkin0)).then((res) => res || fetchAndCreateUrl(portraitUrlBaseWith0)).then((res) => res || fetchAndCreateUrl(portraitUrlBaseWithExtraNameOnImage)),
        ]);

        const championImageUrls = {
          splashCentered: newSplashCentered || existingImages?.splashCentered,
          splashTile: newSplashTile || existingImages?.splashTile,
          square: newSquare || existingImages?.square,
          portrait: newPortrait || existingImages?.portrait,
        };
        imageCache.set(alias, championImageUrls);
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
