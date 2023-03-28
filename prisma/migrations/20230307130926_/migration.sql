/*
  Warnings:

  - You are about to drop the column `user_id` on the `Post` table. All the data in the column will be lost.
  - Added the required column `auther_id` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_user_id_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "user_id",
ADD COLUMN     "auther_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_auther_id_fkey" FOREIGN KEY ("auther_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
