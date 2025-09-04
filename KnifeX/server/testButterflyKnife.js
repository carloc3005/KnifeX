import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testButterflyKnife() {
  try {
    console.log('🔍 Checking for Butterfly Knife in database...');
    
    // Find all Butterfly Knives
    const butterflyKnives = await prisma.knife.findMany({
      where: {
        itemType: 'Butterfly Knife'
      },
      take: 5 // Just show first 5
    });

    console.log(`✅ Found ${butterflyKnives.length} Butterfly Knife variants in database:`);
    
    butterflyKnives.forEach((knife, index) => {
      console.log(`  ${index + 1}. ${knife.itemType} | ${knife.finishName} ${knife.statTrak ? '(StatTrak™)' : ''}`);
      console.log(`     Quality: ${knife.quality} | Rarity: ${knife.rarity}`);
      console.log(`     Image: ${knife.imageUrl}`);
      console.log('');
    });

    // Check if Butterfly Knife Fade exists (our starter knife)
    const butterflyFade = await prisma.knife.findFirst({
      where: {
        itemType: 'Butterfly Knife',
        finishName: 'Fade',
        statTrak: false
      }
    });

    if (butterflyFade) {
      console.log('✅ Butterfly Knife | Fade found in database (our starter knife)');
    } else {
      console.log('❌ Butterfly Knife | Fade NOT found in database');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testButterflyKnife();
