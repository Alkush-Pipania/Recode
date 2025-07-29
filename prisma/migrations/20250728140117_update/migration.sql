/*
  Warnings:

  - The values [skipped,failed] on the enum `CompletionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `defaultReminderDays` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[leetcodeUsername]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CompletionStatus_new" AS ENUM ('pending', 'completed');
ALTER TABLE "UserProgress" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "UserProgress" ALTER COLUMN "status" TYPE "CompletionStatus_new" USING ("status"::text::"CompletionStatus_new");
ALTER TABLE "QuestionAttempt" ALTER COLUMN "status" TYPE "CompletionStatus_new" USING ("status"::text::"CompletionStatus_new");
ALTER TABLE "ExternalQuestionAttempt" ALTER COLUMN "status" TYPE "CompletionStatus_new" USING ("status"::text::"CompletionStatus_new");
ALTER TYPE "CompletionStatus" RENAME TO "CompletionStatus_old";
ALTER TYPE "CompletionStatus_new" RENAME TO "CompletionStatus";
DROP TYPE "CompletionStatus_old";
ALTER TABLE "UserProgress" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "defaultReminderDays",
ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "leetcodeUsername" TEXT;

-- CreateTable
CREATE TABLE "ExternalQuestionAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "link" TEXT,
    "difficulty" "Difficulty",
    "status" "CompletionStatus" NOT NULL DEFAULT 'completed',
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalQuestionAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExternalQuestionAttempt_userId_attemptedAt_idx" ON "ExternalQuestionAttempt"("userId", "attemptedAt");

-- CreateIndex
CREATE INDEX "ExternalQuestionAttempt_slug_idx" ON "ExternalQuestionAttempt"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Question_slug_key" ON "Question"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_leetcodeUsername_key" ON "user"("leetcodeUsername");

-- AddForeignKey
ALTER TABLE "ExternalQuestionAttempt" ADD CONSTRAINT "ExternalQuestionAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
