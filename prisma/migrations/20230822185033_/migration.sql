-- CreateTable
CREATE TABLE "UserHFCPetition" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "phone" INTEGER NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "status" TEXT NOT NULL,
    "ontSerial" VARCHAR(255) NOT NULL,
    "Mac" VARCHAR(255) NOT NULL,
    "olt" VARCHAR(255) NOT NULL,
    "imageURL" VARCHAR(255) NOT NULL,

    CONSTRAINT "UserHFCPetition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Olt" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "ipAddress" VARCHAR(255) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Olt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Olt_name_key" ON "Olt"("name");
