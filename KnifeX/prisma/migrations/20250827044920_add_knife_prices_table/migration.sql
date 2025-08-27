-- CreateTable
CREATE TABLE "public"."knife_prices" (
    "id" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "finishName" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "statTrak" BOOLEAN NOT NULL DEFAULT false,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "lowPrice" DOUBLE PRECISION,
    "highPrice" DOUBLE PRECISION,
    "avgPrice" DOUBLE PRECISION,
    "volume" INTEGER NOT NULL DEFAULT 0,
    "trend" TEXT NOT NULL DEFAULT 'STABLE',
    "lastSalePrice" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "knifeId" TEXT,

    CONSTRAINT "knife_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "knife_prices_itemType_finishName_condition_statTrak_key" ON "public"."knife_prices"("itemType", "finishName", "condition", "statTrak");

-- AddForeignKey
ALTER TABLE "public"."knife_prices" ADD CONSTRAINT "knife_prices_knifeId_fkey" FOREIGN KEY ("knifeId") REFERENCES "public"."knives"("id") ON DELETE SET NULL ON UPDATE CASCADE;
