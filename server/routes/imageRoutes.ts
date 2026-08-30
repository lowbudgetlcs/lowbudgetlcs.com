import express from "express";
import { imageCache } from "../images/storeAllImages";
import { getAllImages } from "../images/getAllImages";

const imageRoutes = express.Router();
const maxTeamLogoSize = 5 * 1024 * 1024;

imageRoutes.get("/api/team-logo/:fileId", async (req, res) => {
  const { fileId } = req.params;
  if (!/^[A-Za-z0-9_-]+$/.test(fileId)) {
    return res.status(400).json({ error: "Invalid Google Drive file ID" });
  }

  try {
    const driveResponse = await fetch(`https://drive.google.com/uc?export=view&id=${encodeURIComponent(fileId)}`);
    if (!driveResponse.ok) {
      return res.status(502).json({ error: "Unable to retrieve team logo" });
    }

    const contentType = driveResponse.headers.get("content-type");
    const contentLength = Number(driveResponse.headers.get("content-length") ?? 0);
    if (!contentType?.startsWith("image/") || contentLength > maxTeamLogoSize) {
      return res.status(502).json({ error: "Google Drive file is not a supported team logo" });
    }

    const imageBuffer = Buffer.from(await driveResponse.arrayBuffer());
    if (imageBuffer.length > maxTeamLogoSize) {
      return res.status(502).json({ error: "Team logo exceeds the 5 MB limit" });
    }

    res.set("Cache-Control", "public, max-age=86400");
    res.type(contentType);
    return res.send(imageBuffer);
  } catch (error) {
    console.error("Error proxying Google Drive team logo:", error);
    return res.status(502).json({ error: "Unable to retrieve team logo" });
  }
});

imageRoutes.get("/api/champion/:champion/:type", async (req, res) => {
  try {
    const championName = req.params.champion.toLowerCase();

    const imageType = req.params.type; // 'splashCentered', 'splashTile', 'square', or 'portrait'
    let imageFind = null;
    if (!isNaN(Number(championName))) {
      imageFind = await getAllImages(championName, imageType, Number(championName));
    } else {
      imageFind = await getAllImages(championName, imageType);
    }

    if (imageFind) {
      res.set("Content-Type", imageFind.contentType);
      res.send(imageFind.buffer);
    } else {
      res.status(404).json({ error: "Champion images not found" });
    }
  } catch (error) {
    console.error("Error fetching champion images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default imageRoutes;
