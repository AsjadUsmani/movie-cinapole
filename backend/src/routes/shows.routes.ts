import { Router } from "express";
import { getShows } from "../controllers/shows.controllers";

const router = Router();

// GET /shows
router.get("/", getShows);

export default router;
