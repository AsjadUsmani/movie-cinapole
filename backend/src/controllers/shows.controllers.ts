import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export async function getShows(req: Request, res: Response) {
  try {
    const {
      title,
      from,
      to,
      page = "1",
      limit = "20",
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const now = new Date();

    const where: any = {
      showTime: {
        gte: now, // do not show old shows
      },
    };

    if (title) {
      where.title = {
        contains: title as string,
        mode: "insensitive",
      };
    }

    if (from || to) {
      where.showTime = {
        ...where.showTime,
        ...(from ? { gte: new Date(from as string) } : { gte: now }),
        ...(to ? { lte: new Date(to as string) } : {}),
      };
    }

    const [data, total] = await Promise.all([
      prisma.masterShow.findMany({
        where,
        orderBy: { showTime: "asc" },
        skip,
        take: limitNum,
      }),
      prisma.masterShow.count({ where }),
    ]);

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
