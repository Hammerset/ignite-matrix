-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ebitMargin" DOUBLE PRECISION,
    "shareOfWallet" DOUBLE PRECISION,
    "spend" DOUBLE PRECISION,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);
