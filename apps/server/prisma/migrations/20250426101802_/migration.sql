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
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "day_of_week" TEXT NOT NULL,
    "time_of_day" TEXT NOT NULL,
    "current_emotion" TEXT NOT NULL,
    "desired_emotion" TEXT NOT NULL,
    "audio_seed" TEXT,
    "visual_seed" TEXT,
    "color_palette" TEXT,
    "info" TEXT,
    "text" TEXT,

    CONSTRAINT "Petal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Petal_user_id_idx" ON "Petal"("user_id");

-- AddForeignKey
ALTER TABLE "Petal" ADD CONSTRAINT "Petal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
