/*
  Warnings:

  - You are about to drop the `Follows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedPoem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkshopCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkshopEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkshopFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkshopInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkshopSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkshopTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WorkshopToWorkshopTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `submissionId` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `featured` on the `Poem` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Poem` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Workshop` table. All the data in the column will be lost.
  - You are about to drop the column `hostId` on the `Workshop` table. All the data in the column will be lost.
  - You are about to drop the column `joinedAt` on the `WorkshopMember` table. All the data in the column will be lost.
  - Made the column `poemId` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `Like` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `creatorId` to the `Workshop` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Submission_workshopId_idx";

-- DropIndex
DROP INDEX "Submission_authorId_idx";

-- DropIndex
DROP INDEX "WorkshopEvent_workshopId_idx";

-- DropIndex
DROP INDEX "WorkshopFeedback_submissionId_idx";

-- DropIndex
DROP INDEX "WorkshopFeedback_authorId_idx";

-- DropIndex
DROP INDEX "WorkshopInvitation_invitedUserId_idx";

-- DropIndex
DROP INDEX "WorkshopInvitation_invitedById_idx";

-- DropIndex
DROP INDEX "WorkshopInvitation_workshopId_idx";

-- DropIndex
DROP INDEX "WorkshopInvitation_code_key";

-- DropIndex
DROP INDEX "WorkshopSubmission_workshopId_idx";

-- DropIndex
DROP INDEX "WorkshopSubmission_authorId_idx";

-- DropIndex
DROP INDEX "WorkshopTag_name_key";

-- DropIndex
DROP INDEX "_WorkshopToWorkshopTag_B_index";

-- DropIndex
DROP INDEX "_WorkshopToWorkshopTag_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Follows";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SavedPoem";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Submission";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WorkshopCategory";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WorkshopEvent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WorkshopFeedback";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WorkshopInvitation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WorkshopSubmission";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WorkshopTag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_WorkshopToWorkshopTag";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "poemId" TEXT NOT NULL,
    CONSTRAINT "Feedback_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Feedback_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "Poem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Workshop_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "maxMembers" INTEGER NOT NULL DEFAULT 20,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "Workshop_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copy data from old table to new table
INSERT INTO "Workshop_new" ("id", "title", "description", "isPrivate", "maxMembers", "createdAt", "updatedAt", "creatorId")
SELECT "id", "title", "description", "isPrivate", "maxMembers", "createdAt", "updatedAt", "hostId"
FROM "Workshop";

-- Drop old table
DROP TABLE "Workshop";

-- Rename new table to old table name
ALTER TABLE "Workshop_new" RENAME TO "Workshop";

-- CreateTable
CREATE TABLE "Draft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "workshopId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    CONSTRAINT "Draft_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Draft_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DraftToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DraftToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Draft" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DraftToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Workshop_creatorId_idx" ON "Workshop"("creatorId");

-- CreateIndex
CREATE INDEX "Draft_authorId_idx" ON "Draft"("authorId");

-- CreateIndex
CREATE INDEX "Draft_workshopId_idx" ON "Draft"("workshopId");

-- CreateIndex
CREATE UNIQUE INDEX "_DraftToTag_AB_unique" ON "_DraftToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_DraftToTag_B_index" ON "_DraftToTag"("B");

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "poemId" TEXT NOT NULL,
    CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "Poem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("authorId", "content", "createdAt", "id", "poemId", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "poemId", "updatedAt" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");
CREATE INDEX "Comment_poemId_idx" ON "Comment"("poemId");
CREATE TABLE "new_Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "poemId" TEXT NOT NULL,
    CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Like_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "Poem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("createdAt", "poemId", "userId") SELECT "createdAt", "poemId", "userId" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
CREATE INDEX "Like_userId_idx" ON "Like"("userId");
CREATE INDEX "Like_poemId_idx" ON "Like"("poemId");
CREATE UNIQUE INDEX "Like_userId_poemId_key" ON "Like"("userId", "poemId");
CREATE TABLE "new_Poem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "authorId" TEXT NOT NULL,
    "workshopId" TEXT,
    CONSTRAINT "Poem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Poem_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Poem" ("authorId", "content", "createdAt", "id", "published", "title", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "published", "title", "updatedAt" FROM "Poem";
DROP TABLE "Poem";
ALTER TABLE "new_Poem" RENAME TO "Poem";
CREATE INDEX "Poem_authorId_idx" ON "Poem"("authorId");
CREATE INDEX "Poem_workshopId_idx" ON "Poem"("workshopId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("bio", "createdAt", "email", "id", "image", "name", "updatedAt") SELECT "bio", "createdAt", "email", "id", "image", "name", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_WorkshopMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    CONSTRAINT "WorkshopMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkshopMember_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WorkshopMember" ("id", "role", "userId", "workshopId") SELECT "id", "role", "userId", "workshopId" FROM "WorkshopMember";
DROP TABLE "WorkshopMember";
ALTER TABLE "new_WorkshopMember" RENAME TO "WorkshopMember";
CREATE INDEX "WorkshopMember_userId_idx" ON "WorkshopMember"("userId");
CREATE INDEX "WorkshopMember_workshopId_idx" ON "WorkshopMember"("workshopId");
CREATE UNIQUE INDEX "WorkshopMember_userId_workshopId_key" ON "WorkshopMember"("userId", "workshopId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "Feedback_authorId_idx" ON "Feedback"("authorId");

-- CreateIndex
CREATE INDEX "Feedback_poemId_idx" ON "Feedback"("poemId");
