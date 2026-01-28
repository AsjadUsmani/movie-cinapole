import "dotenv/config";
import express from "express";
import showsRoutes from "./routes/shows.routes";
import syncRoutes from "./routes/sync.routes";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

// health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use(cors())

// routes
app.use("/shows", showsRoutes);
app.use("/sync", syncRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
