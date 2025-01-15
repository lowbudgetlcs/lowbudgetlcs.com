// Import Champ Icon Images from folder
const modules = import.meta.glob("../../assets/champion/*.png");
const images: Record<string, string> = {};
export const loadChampImages = async () => {
  for (const path in modules) {
    const name = path.match(/([^/]+)(?=\.\w+$)/)?.[0];
    if (name) {
      const module = (await modules[path]()) as { default: string };
      images[name] = module.default;
    }
  }
  return images;
};

// Import Champ Full Images from folder
const largeModules = import.meta.glob("../../assets/championLarge/*_0.jpg");
const largeImages: Record<string, string> = {};
export const loadLargeChampImages = async () => {
  for (const path in largeModules) {
    const name = path.match(/([^/]+)(?=_0\.jpg$)/)?.[0];
    if (name) {
      const largeModule = (await largeModules[path]()) as { default: string };
      largeImages[name] = largeModule.default;
    }
  }
  return largeImages;
};
