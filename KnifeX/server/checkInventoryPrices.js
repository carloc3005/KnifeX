import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserInventoryPrices() {
  console.log('Checking user_inventories table for price data...');
  
  const inventories = await prisma.userInventory.findMany({
    take: 5,
    select: {
      condition: true,
      price: true,
      knife: {
        select: {
          itemType: true,
          finishName: true
        }
      }
    }
  });
  
  console.log('Sample user inventory prices:');
  inventories.forEach(item => {
    console.log(`- ${item.knife.itemType} | ${item.knife.finishName} (${item.condition}): $${item.price} (type: ${typeof item.price})`);
  });
  
  const count = await prisma.userInventory.count();
  console.log(`\nTotal items in user_inventories table: ${count}`);
  
  await prisma.$disconnect();
}

checkUserInventoryPrices().catch(console.error);