import express from "express";
import { imageCache } from "../images/storeAllImages";
import { getAllImages } from "../images/getAllImages";

const imageRoutes = express.Router();

imageRoutes.get("/api/champions/:champion/:type", async (req, res) => {
  try {
    const championName = req.params.champion;
    const imageType = req.params.type; // 'splashCentered', 'splashTile', or 'square'
    const imageFind = await getAllImages(championName, imageType);
    if (imageFind) {
      res.status(200).json(imageFind);
    } else {
      res.status(404).json({ error: "Champion images not found" });
    }
  } catch (error) {
    console.error("Error fetching champion images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default imageRoutes;
