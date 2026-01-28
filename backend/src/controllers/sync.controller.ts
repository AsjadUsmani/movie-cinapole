import { Request, Response } from "express";
import { syncFromApi } from "../scripts/syncFromApi";
import { reconcileToMaster } from "../scripts/reconcileToMaster";

export async function runSync(req: Request, res: Response) {
  try {
    await syncFromApi();
    await reconcileToMaster();

    res.json({ status: "ok", message: "Sync completed" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: "error", message: "Sync failed" });
  }
}
