-- CreateTable
CREATE TABLE "SyncShow" (
    "id" SERIAL NOT NULL,
    "movieID" TEXT NOT NULL,
    "cinemaId" INTEGER NOT NULL,
    "screenName" TEXT NOT NULL,
    "showTime" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "rating" TEXT,
    "length" INTEGER,
    "format" TEXT,
    "genere" TEXT,
    "isActive" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncShow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterShow" (
    "id" SERIAL NOT NULL,
    "movieID" TEXT NOT NULL,
    "cinemaId" INTEGER NOT NULL,
    "screenName" TEXT NOT NULL,
    "showTime" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "rating" TEXT,
    "length" INTEGER,
    "format" TEXT,
    "genere" TEXT,
    "isActive" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterShow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SyncShow_movieID_cinemaId_screenName_showTime_key" ON "SyncShow"("movieID", "cinemaId", "screenName", "showTime");

-- CreateIndex
CREATE UNIQUE INDEX "MasterShow_movieID_cinemaId_screenName_showTime_key" ON "MasterShow"("movieID", "cinemaId", "screenName", "showTime");
