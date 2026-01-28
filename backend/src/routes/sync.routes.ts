import { Router } from "express";
import { runSync } from "../controllers/sync.controller";

const router = Router();
router.post("/", runSync);
export default router;
