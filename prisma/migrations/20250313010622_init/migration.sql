/*
  Warnings:

  - Added the required column `submissionId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'POEM',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    CONSTRAINT "Submission_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Submission_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkshopCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkshopTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkshopEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkshopEvent_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_WorkshopToWorkshopTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_WorkshopToWorkshopTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Workshop" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_WorkshopToWorkshopTag_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkshopTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "submissionId" TEXT NOT NULL,
    "poemId" TEXT,
    CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "Poem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("authorId", "content", "createdAt", "id", "poemId", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "poemId", "updatedAt" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");
CREATE INDEX "Comment_submissionId_idx" ON "Comment"("submissionId");
CREATE INDEX "Comment_poemId_idx" ON "Comment"("poemId");
CREATE TABLE "new_Poem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'POEM',
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
    "categoryId" TEXT,
    "hostId" TEXT NOT NULL,
    CONSTRAINT "Workshop_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WorkshopCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Workshop_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Workshop" ("createdAt", "description", "hostId", "id", "isPrivate", "maxMembers", "title", "updatedAt") SELECT "createdAt", "description", "hostId", "id", "isPrivate", "maxMembers", "title", "updatedAt" FROM "Workshop";
DROP TABLE "Workshop";
ALTER TABLE "new_Workshop" RENAME TO "Workshop";
CREATE INDEX "Workshop_hostId_idx" ON "Workshop"("hostId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Submission_authorId_idx" ON "Submission"("authorId");

-- CreateIndex
CREATE INDEX "Submission_workshopId_idx" ON "Submission"("workshopId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkshopTag_name_key" ON "WorkshopTag"("name");

-- CreateIndex
CREATE INDEX "WorkshopEvent_workshopId_idx" ON "WorkshopEvent"("workshopId");

-- CreateIndex
CREATE UNIQUE INDEX "_WorkshopToWorkshopTag_AB_unique" ON "_WorkshopToWorkshopTag"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkshopToWorkshopTag_B_index" ON "_WorkshopToWorkshopTag"("B");
