import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.js";
import dashboardRoutes from "./routes/dashboard.js";
import askRoutes from "./routes/ask.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    const level = ms > 1000 ? "warn" : "info";
    logger[level]({ method: req.method, url: req.originalUrl, status: res.statusCode, ms }, "request");
  });
  next();
});

app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ask", askRoutes);

if (process.env.NODE_ENV === "production") {
  const clientBuild = path.join(__dirname, "../../../client/dist");
  app.use(express.static(clientBuild));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

app.listen(PORT, () => {
  logger.info({ port: PORT }, "PulseBI server running");
});
