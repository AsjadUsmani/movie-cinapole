import { PrismaClient } from "./generated/prisma/client.js";
import dotenv from "dotenv";
dotenv.config();


const prisma = new PrismaClient();

function hasChanged(sync: any, master: any) {
  return (
    sync.title !== master.title ||
    sync.rating !== master.rating ||
    sync.length !== master.length ||
    sync.format !== master.format ||
    sync.genere !== master.genere ||
    sync.isActive !== master.isActive ||
    sync.imageUrl !== master.imageUrl
  );
}

async function reconcileToMaster() {
  console.log("Reconciling SyncShow → MasterShow...");

  const syncRows = await prisma.syncShow.findMany();

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;

  for (const row of syncRows) {
    const master = await prisma.masterShow.findUnique({
      where: {
        movieID_cinemaId_screenName_showTime: {
          movieID: row.movieID,
          cinemaId: row.cinemaId,
          screenName: row.screenName,
          showTime: row.showTime,
        },
      },
    });

    if (!master) {
      await prisma.masterShow.create({
        data: {
          movieID: row.movieID,
          cinemaId: row.cinemaId,
          screenName: row.screenName,
          showTime: row.showTime,

          title: row.title,
          rating: row.rating,
          length: row.length,
          format: row.format,
          genere: row.genere,
          isActive: row.isActive,
          imageUrl: row.imageUrl,
        },
      });

      inserted++;
    } else if (hasChanged(row, master)) {
      await prisma.masterShow.update({
        where: { id: master.id },
        data: {
          title: row.title,
          rating: row.rating,
          length: row.length,
          format: row.format,
          genere: row.genere,
          isActive: row.isActive,
          imageUrl: row.imageUrl,
        },
      });

      updated++;
    } else {
      unchanged++;
    }
  }

  console.log(
    `Done. Inserted: ${inserted}, Updated: ${updated}, Unchanged: ${unchanged}`
  );
}

reconcileToMaster()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
