import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function syncFromApi() {
  console.log("Fetching shows from API...");

  const response = await axios.get(
    "https://api.cinepolisindia.com/api/movies/all-shows"
  );

  const shows: ApiShow[] = response.data.data.allShows;

  console.log(`Received ${shows.length} shows`);

  for (const show of shows) {
    await prisma.syncShow.upsert({
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
    });
  }

  console.log("Sync table updated successfully.");
}

syncFromApi()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
