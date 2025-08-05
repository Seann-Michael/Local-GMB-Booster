import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleSecureMedia,
  handlePublicMedia,
  handleThumbnails,
  handleMediaUpload,
  handleMediaMetadata
} from "./routes/media";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Secure Media Routes
  app.get("/api/media/:mediaId/:filename", handleSecureMedia);
  app.get("/api/media/thumbs/:size/:mediaId/:filename", handleThumbnails);
  app.post("/api/media/upload", handleMediaUpload);
  app.get("/api/media/metadata/:mediaId", handleMediaMetadata);

  // Public Media Routes
  app.get("/public/media/:publicId/:filename", handlePublicMedia);
  app.get("/public/media/thumbs/:size/:publicId/:filename", handleThumbnails);

  return app;
}
