const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testKnifeImages() {
  try {
    const inventory = await prisma.userInventory.findMany({
      include: { knife: true },
      take: 5
    });
    
    console.log('Sample knife data from DB:');
    inventory.forEach(item => {
      console.log(`- ${item.knife.itemType} | ${item.knife.finishName}`);
    });
    
    console.log('\nTesting image file matching logic:');
    
    // Simulate the function logic
    function normalizeKnifeType(type) {
      return type.toLowerCase()
        .replace(/\s+knife$/i, '') // Remove "Knife" suffix if present
        .replace(/\s+/g, '');       // Remove spaces
    }
    
    function normalizeFinishName(finish) {
      return finish.toLowerCase()
        .replace(/\s+/g, '-')       // Replace spaces with hyphens
        .replace(/[™®]/g, '');      // Remove trademark symbols
    }
    
    inventory.forEach(item => {
      const normalizedType = normalizeKnifeType(item.knife.itemType);
      const normalizedFinish = normalizeFinishName(item.knife.finishName);
      const expectedFilename = `${normalizedType}-${normalizedFinish}.png`;
      
      console.log(`\n${item.knife.itemType} | ${item.knife.finishName}`);
      console.log(`  Expected filename: ${expectedFilename}`);
      console.log(`  Folder: ${item.knife.itemType}/`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testKnifeImages();
