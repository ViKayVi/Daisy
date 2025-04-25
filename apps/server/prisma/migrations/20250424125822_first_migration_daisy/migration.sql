-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Petal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dayOfWeek" TEXT NOT NULL,
    "timeOfDay" TEXT NOT NULL,
    "currentEmotion" TEXT NOT NULL,
    "desiredEmotion" TEXT NOT NULL,
    "audioSeed" TEXT NOT NULL,
    "visualSeed" TEXT NOT NULL,
    "colorPalette" TEXT NOT NULL,
    "info" TEXT,

    CONSTRAINT "Petal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Petal" ADD CONSTRAINT "Petal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
