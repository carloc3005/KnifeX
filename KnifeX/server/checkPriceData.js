import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKnifePrices() {
  console.log('Checking knife_prices table data...');
  
  const prices = await prisma.knifePrice.findMany({
    take: 5, // Just show first 5 rows
    select: {
      itemType: true,
      finishName: true,
      condition: true,
      currentPrice: true,
      avgPrice: true,
      volume: true,
      trend: true
    }
  });
  
  console.log('Sample knife prices:');
  prices.forEach(price => {
    console.log(`- ${price.itemType} | ${price.finishName} (${price.condition}): $${price.currentPrice} (avg: $${price.avgPrice}, vol: ${price.volume})`);
  });
  
  const count = await prisma.knifePrice.count();
  console.log(`\nTotal rows in knife_prices table: ${count}`);
  
  await prisma.$disconnect();
}

checkKnifePrices().catch(console.error);