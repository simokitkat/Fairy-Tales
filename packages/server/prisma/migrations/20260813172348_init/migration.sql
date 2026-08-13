-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "uploadsPlaylistId" TEXT NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fairy_tales" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "canonicalTitle" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,

    CONSTRAINT "fairy_tales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "fairyTaleId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "fairyTaleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fairy_tales_slug_key" ON "fairy_tales"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "translations_fairyTaleId_language_key" ON "translations"("fairyTaleId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "videos_youtubeId_key" ON "videos"("youtubeId");

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_fairyTaleId_fkey" FOREIGN KEY ("fairyTaleId") REFERENCES "fairy_tales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_fairyTaleId_fkey" FOREIGN KEY ("fairyTaleId") REFERENCES "fairy_tales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
