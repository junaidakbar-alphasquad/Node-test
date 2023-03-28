-- CreateTable
CREATE TABLE "Logger" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "timestamp" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "Logger_pkey" PRIMARY KEY ("id")
);
