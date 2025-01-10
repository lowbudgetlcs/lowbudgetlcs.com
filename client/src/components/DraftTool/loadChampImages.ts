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
      return images
    };
