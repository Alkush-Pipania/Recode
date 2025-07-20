/*
  Warnings:

  - You are about to drop the column `notes` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Question` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `Question` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `link` on the `Question` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `name` on the `Topic` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.

*/
-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "CompletionStatus" AS ENUM ('pending', 'completed', 'skipped', 'failed');

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_userId_fkey";

-- DropIndex
DROP INDEX "Question_userId_idx";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "notes",
DROP COLUMN "userId",
ADD COLUMN     "defaultReminderDays" INTEGER NOT NULL DEFAULT 7,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "link" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "description" TEXT,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(200);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "status" "CompletionStatus" NOT NULL DEFAULT 'pending',
    "firstCompletedAt" TIMESTAMP(3),
    "lastCompletedAt" TIMESTAMP(3),
    "completionCount" INTEGER NOT NULL DEFAULT 0,
    "reminderType" "ReminderType" NOT NULL DEFAULT 'medium',
    "customReminderDays" INTEGER,
    "nextReminderAt" TIMESTAMP(3),
    "lastRemindedAt" TIMESTAMP(3),
    "notes" TEXT,
    "timeSpentMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "status" "CompletionStatus" NOT NULL,
    "timeSpent" INTEGER,
    "notes" TEXT,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserProgress_userId_status_idx" ON "UserProgress"("userId", "status");

-- CreateIndex
CREATE INDEX "UserProgress_nextReminderAt_idx" ON "UserProgress"("nextReminderAt");

-- CreateIndex
CREATE INDEX "UserProgress_userId_nextReminderAt_idx" ON "UserProgress"("userId", "nextReminderAt");

-- CreateIndex
CREATE INDEX "UserProgress_lastCompletedAt_idx" ON "UserProgress"("lastCompletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_questionId_key" ON "UserProgress"("userId", "questionId");

-- CreateIndex
CREATE INDEX "QuestionAttempt_userId_questionId_attemptedAt_idx" ON "QuestionAttempt"("userId", "questionId", "attemptedAt");

-- CreateIndex
CREATE INDEX "QuestionAttempt_attemptedAt_idx" ON "QuestionAttempt"("attemptedAt");

-- CreateIndex
CREATE INDEX "Question_difficulty_idx" ON "Question"("difficulty");

-- CreateIndex
CREATE INDEX "Question_createdAt_idx" ON "Question"("createdAt");

-- CreateIndex
CREATE INDEX "Question_difficulty_createdAt_idx" ON "Question"("difficulty", "createdAt");

-- CreateIndex
CREATE INDEX "QuestionTopic_topicId_idx" ON "QuestionTopic"("topicId");

-- CreateIndex
CREATE INDEX "Topic_name_idx" ON "Topic"("name");

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
