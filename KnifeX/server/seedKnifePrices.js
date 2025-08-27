import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Sample knife price data - you can expand this with real market data
const knifePrices = [
  // Karambit prices
  {
    itemType: 'Karambit',
    finishName: 'Doppler',
    condition: 'Factory New',
    statTrak: false,
    currentPrice: 850.50,
    lowPrice: 820.00,
    highPrice: 900.00,
    avgPrice: 865.00,
    volume: 45,
    trend: 'RISING'
  },
  {
    itemType: 'Karambit',
    finishName: 'Fade',
    condition: 'Factory New',
    statTrak: false,
    currentPrice: 1250.00,
    lowPrice: 1200.00,
    highPrice: 1350.00,
    avgPrice: 1275.00,
    volume: 23,
    trend: 'STABLE'
  },
  {
    itemType: 'Karambit',
    finishName: 'Tiger Tooth',
    condition: 'Factory New',
    statTrak: false,
    currentPrice: 950.75,
    lowPrice: 920.00,
    highPrice: 980.00,
    avgPrice: 955.00,
    volume: 38,
    trend: 'STABLE'
  },
  
  // M9 Bayonet prices
  {
    itemType: 'M9 Bayonet',
    finishName: 'Doppler',
    condition: 'Factory New',
    statTrak: false,
    currentPrice: 450.25,
    lowPrice: 420.00,
    highPrice: 480.00,
    avgPrice: 455.00,
    volume: 67,
    trend: 'RISING'
  },
  {
    itemType: 'M9 Bayonet',
    finishName: 'Fade',
    condition: 'Factory New',
    statTrak: false,
    currentPrice: 650.00,
    lowPrice: 620.00,
    highPrice: 690.00,
    avgPrice: 655.00,
    volume: 34,
    trend: 'STABLE'
  },
  
  // Flip Knife prices
  {
    itemType: 'Flip Knife',
    finishName: 'Doppler',
    condition: 'Factory New',
    statTrak: false,
    currentPrice: 285.50,
    lowPrice: 270.00,
    highPrice: 300.00,
    avgPrice: 287.50,
    volume: 89,
    trend: 'FALLING'
  },
  {
    itemType: 'Flip Knife',
    finishName: 'Fade',
    condition: 'Factory New',
    statTrak: false,
    currentPrice: 320.75,
    lowPrice: 310.00,
    highPrice: 340.00,
    avgPrice: 325.00,
    volume: 52,
    trend: 'STABLE'
  },
  
  // Gut Knife prices
  {
    itemType: 'Gut Knife',
    finishName: 'Doppler',
    condition: 'Factory New',
    statTrak: false,
    currentPrice: 165.25,
    lowPrice: 155.00,
    highPrice: 175.00,
    avgPrice: 167.50,
    volume: 123,
    trend: 'RISING'
  },
  
  // Huntsman Knife prices
  {
    itemType: 'Huntsman Knife',
    finishName: 'Fade',
    condition: 'Factory New',
    statTrak: false,
    currentPrice: 275.00,
    lowPrice: 260.00,
    highPrice: 290.00,
    avgPrice: 277.50,
    volume: 76,
    trend: 'STABLE'
  },
  
  // StatTrak variants (higher prices)
  {
    itemType: 'Karambit',
    finishName: 'Doppler',
    condition: 'Factory New',
    statTrak: true,
    currentPrice: 1150.00,
    lowPrice: 1100.00,
    highPrice: 1200.00,
    avgPrice: 1145.00,
    volume: 12,
    trend: 'RISING'
  },
  
  // Different conditions for same knife
  {
    itemType: 'Karambit',
    finishName: 'Doppler',
    condition: 'Minimal Wear',
    statTrak: false,
    currentPrice: 780.00,
    lowPrice: 750.00,
    highPrice: 810.00,
    avgPrice: 785.00,
    volume: 34,
    trend: 'STABLE'
  },
  {
    itemType: 'Karambit',
    finishName: 'Doppler',
    condition: 'Field-Tested',
    statTrak: false,
    currentPrice: 650.50,
    lowPrice: 620.00,
    highPrice: 680.00,
    avgPrice: 655.00,
    volume: 28,
    trend: 'FALLING'
  }
];

async function seedKnifePrices() {
  console.log('🔪 Seeding knife prices...');
  
  try {
    // Clear existing knife prices
    await prisma.knifePrice.deleteMany();
    console.log('✅ Cleared existing knife prices');
    
    // Insert new knife prices
    for (const priceData of knifePrices) {
      await prisma.knifePrice.create({
        data: {
          ...priceData,
          lastSalePrice: priceData.currentPrice * (0.95 + Math.random() * 0.1), // simulate last sale
          lastUpdated: new Date()
        }
      });
    }
    
    console.log(`✅ Created ${knifePrices.length} knife price entries`);
    
    // Display some statistics
    const totalPrices = await prisma.knifePrice.count();
    const avgPrice = await prisma.knifePrice.aggregate({
      _avg: {
        currentPrice: true
      }
    });
    
    console.log(`📊 Total knife prices in database: ${totalPrices}`);
    console.log(`💰 Average knife price: $${avgPrice._avg.currentPrice?.toFixed(2)}`);
    
  } catch (error) {
    console.error('❌ Error seeding knife prices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedKnifePrices();

export { seedKnifePrices };
