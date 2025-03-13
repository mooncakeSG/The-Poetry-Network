/*
  Warnings:

  - You are about to drop the column `capacity` on the `Workshop` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Workshop` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Workshop` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "WorkshopMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    CONSTRAINT "WorkshopMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkshopMember_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkshopSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    CONSTRAINT "WorkshopSubmission_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkshopSubmission_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkshopFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    CONSTRAINT "WorkshopFeedback_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "WorkshopMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkshopFeedback_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "WorkshopSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkshopInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "workshopId" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "invitedUserId" TEXT,
    CONSTRAINT "WorkshopInvitation_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkshopInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkshopInvitation_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

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
    CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "Poem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("authorId", "content", "createdAt", "id", "poemId", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "poemId", "updatedAt" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");
CREATE INDEX "Comment_poemId_idx" ON "Comment"("poemId");
CREATE TABLE "new_Poem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Poem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Poem" ("authorId", "content", "createdAt", "featured", "id", "published", "title", "updatedAt") SELECT "authorId", "content", "createdAt", "featured", "id", "published", "title", "updatedAt" FROM "Poem";
DROP TABLE "Poem";
ALTER TABLE "new_Poem" RENAME TO "Poem";
CREATE INDEX "Poem_authorId_idx" ON "Poem"("authorId");
CREATE TABLE "new_Workshop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "maxMembers" INTEGER NOT NULL DEFAULT 20,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hostId" TEXT NOT NULL,
    CONSTRAINT "Workshop_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Workshop" ("createdAt", "description", "hostId", "id", "title", "updatedAt") SELECT "createdAt", "description", "hostId", "id", "title", "updatedAt" FROM "Workshop";
DROP TABLE "Workshop";
ALTER TABLE "new_Workshop" RENAME TO "Workshop";
CREATE INDEX "Workshop_hostId_idx" ON "Workshop"("hostId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "WorkshopMember_userId_idx" ON "WorkshopMember"("userId");

-- CreateIndex
CREATE INDEX "WorkshopMember_workshopId_idx" ON "WorkshopMember"("workshopId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkshopMember_userId_workshopId_key" ON "WorkshopMember"("userId", "workshopId");

-- CreateIndex
CREATE INDEX "WorkshopSubmission_authorId_idx" ON "WorkshopSubmission"("authorId");

-- CreateIndex
CREATE INDEX "WorkshopSubmission_workshopId_idx" ON "WorkshopSubmission"("workshopId");

-- CreateIndex
CREATE INDEX "WorkshopFeedback_authorId_idx" ON "WorkshopFeedback"("authorId");

-- CreateIndex
CREATE INDEX "WorkshopFeedback_submissionId_idx" ON "WorkshopFeedback"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkshopInvitation_code_key" ON "WorkshopInvitation"("code");

-- CreateIndex
CREATE INDEX "WorkshopInvitation_workshopId_idx" ON "WorkshopInvitation"("workshopId");

-- CreateIndex
CREATE INDEX "WorkshopInvitation_invitedById_idx" ON "WorkshopInvitation"("invitedById");

-- CreateIndex
CREATE INDEX "WorkshopInvitation_invitedUserId_idx" ON "WorkshopInvitation"("invitedUserId");
