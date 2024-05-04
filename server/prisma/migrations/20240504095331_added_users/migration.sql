-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('processing', 'redo', 'verified', 'prohibited');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "birthNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "ZIP" TEXT NOT NULL,
    "faceMatched" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'processing',
    "idPicture" TEXT NOT NULL,
    "facePicture" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("birthNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_birthNumber_key" ON "Person"("birthNumber");
