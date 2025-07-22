-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);
