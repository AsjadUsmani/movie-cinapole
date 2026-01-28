import { PrismaClient } from "./generated/prisma/client.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const API_URL = process.env.API_URL!;

type ApiShow = {
  movie_showTime: string;
  screen_name: string;
  is_active: string;
  movie_ID: string;
  movie_title: string;
  movie_rating: string | null;
  movie_length: number | null;
  movie_format: string | null;
  cinema_id: number;
  movie_genere: string | null;
  movie_image_new: string | null;
};

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}


async function syncFromApi() {
  console.log("Loading shows from JSON...");

  const filePath = path.join(__dirname, "../../data/allShows.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const response = JSON.parse(raw);

  const shows: ApiShow[] = response.data.allShows;

  console.log(`Loaded ${shows.length} shows`);
  const batches = chunk(shows, 100);

  for (const batch of batches) {
  await prisma.$transaction(
    batch.map((show) =>
      prisma.syncShow.upsert({
        where: {
          movieID_cinemaId_screenName_showTime: {
            movieID: show.movie_ID,
            cinemaId: show.cinema_id,
            screenName: show.screen_name,
            showTime: new Date(show.movie_showTime),
          },
        },
        update: {
          title: show.movie_title,
          rating: show.movie_rating,
          length: show.movie_length,
          format: show.movie_format,
          genere: show.movie_genere,
          isActive: show.is_active,
          imageUrl: show.movie_image_new,
        },
        create: {
          movieID: show.movie_ID,
          cinemaId: show.cinema_id,
          screenName: show.screen_name,
          showTime: new Date(show.movie_showTime),

          title: show.movie_title,
          rating: show.movie_rating,
          length: show.movie_length,
          format: show.movie_format,
          genere: show.movie_genere,
          isActive: show.is_active,
          imageUrl: show.movie_image_new,
        },
      })
    )
  );
}


  console.log("Sync table updated successfully.");
}

syncFromApi()
  .catch(console.error)
  .finally(() => prisma.$disconnect());