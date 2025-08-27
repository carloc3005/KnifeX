-- CreateEnum
CREATE TYPE "public"."TradeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "steamId" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."knives" (
    "id" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "finishName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "statTrak" BOOLEAN NOT NULL DEFAULT false,
    "rarity" TEXT NOT NULL,
    "caseSources" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_inventory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "knifeId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "floatValue" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "isForTrade" BOOLEAN NOT NULL DEFAULT false,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tradeLocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trades" (
    "id" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "public"."TradeStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trade_items" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "userInventoryId" TEXT NOT NULL,
    "knifeId" TEXT NOT NULL,
    "fromInitiator" BOOLEAN NOT NULL,

    CONSTRAINT "trade_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trade_history" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "itemsGiven" JSONB[],
    "itemsReceived" JSONB[],
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trade_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_steamId_key" ON "public"."users"("steamId");

-- CreateIndex
CREATE UNIQUE INDEX "knives_itemType_finishName_statTrak_key" ON "public"."knives"("itemType", "finishName", "statTrak");

-- CreateIndex
CREATE UNIQUE INDEX "trade_history_tradeId_key" ON "public"."trade_history"("tradeId");

-- AddForeignKey
ALTER TABLE "public"."user_inventory" ADD CONSTRAINT "user_inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_inventory" ADD CONSTRAINT "user_inventory_knifeId_fkey" FOREIGN KEY ("knifeId") REFERENCES "public"."knives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trades" ADD CONSTRAINT "trades_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trades" ADD CONSTRAINT "trades_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trade_items" ADD CONSTRAINT "trade_items_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "public"."trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trade_items" ADD CONSTRAINT "trade_items_userInventoryId_fkey" FOREIGN KEY ("userInventoryId") REFERENCES "public"."user_inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trade_items" ADD CONSTRAINT "trade_items_knifeId_fkey" FOREIGN KEY ("knifeId") REFERENCES "public"."knives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trade_history" ADD CONSTRAINT "trade_history_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "public"."trades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trade_history" ADD CONSTRAINT "trade_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
