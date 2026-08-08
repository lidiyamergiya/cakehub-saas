-- CreateTable
CREATE TABLE "Bakery" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "telegramUsername" TEXT,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Bakery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bakery_ownerId_key" ON "Bakery"("ownerId");

-- AddForeignKey
ALTER TABLE "Bakery" ADD CONSTRAINT "Bakery_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
