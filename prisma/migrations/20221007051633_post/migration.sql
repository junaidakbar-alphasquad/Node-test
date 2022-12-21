-- DropIndex
DROP INDEX "User_email_key";

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "user_id" int NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
