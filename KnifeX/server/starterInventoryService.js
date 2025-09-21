import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to get the current market price for a knife
async function getKnifeMarketPrice(itemType, finishName, condition, statTrak = false) {
  try {
    const priceData = await prisma.knifePrice.findUnique({
      where: {
        itemType_finishName_condition_statTrak: {
          itemType,
          finishName,
          condition,
          statTrak
        }
      }
    });
    
    // Return the current price if found, otherwise return a default price
    return priceData ? priceData.currentPrice : 100.00;
  } catch (error) {
    console.error('Error fetching knife price:', error);
    // Return a default price if there's an error
    return 100.00;
  }
}

// Starter knives that new users will receive
const starterKnives = [
  {
    itemType: 'Butterfly Knife',
    finishName: 'Fade',
    imageUrl: '/src/assets/knives/Butterfly Knife/butterfly-fade.png',
    quality: 'Covert Knife',
    statTrak: false,
    rarity: 'Covert',
    caseSources: ['Operation Breakout Weapon Case']
  },
  {
    itemType: 'Karambit',
    finishName: 'Doppler',
    imageUrl: '/src/assets/knives/Karambit/karambit-doppler.png',
    quality: 'Covert Knife', 
    statTrak: false,
    rarity: 'Covert',
    caseSources: ['Chroma Case']
  },
  {
    itemType: 'M9 Bayonet',
    finishName: 'Tiger Tooth',
    imageUrl: '/src/assets/knives/M9 Knife/m9-tiger-tooth.png',
    quality: 'Covert Knife',
    statTrak: false,
    rarity: 'Covert', 
    caseSources: ['Chroma Case']
  }
];

// Function to create starter knives in database if they don't exist
export async function ensureStarterKnivesExist() {
  try {
    for (const knifeData of starterKnives) {
      const existingKnife = await prisma.knife.findFirst({
        where: {
          itemType: knifeData.itemType,
          finishName: knifeData.finishName,
          statTrak: knifeData.statTrak
        }
      });

      if (!existingKnife) {
        await prisma.knife.create({
          data: knifeData
        });
        console.log(`✅ Created starter knife: ${knifeData.itemType} | ${knifeData.finishName}`);
      }
    }
  } catch (error) {
    console.error('Error ensuring starter knives exist:', error);
    throw error;
  }
}

// Function to add starter knives to a new user's inventory
export async function addStarterKnivesToUser(userId) {
  try {
    // Ensure starter knives exist in database
    await ensureStarterKnivesExist();

    // Get the starter knives from database
    const starterKnivesFromDb = await prisma.knife.findMany({
      where: {
        OR: starterKnives.map(knife => ({
          itemType: knife.itemType,
          finishName: knife.finishName,
          statTrak: knife.statTrak
        }))
      }
    });

    // Add each starter knife to user's inventory
    const inventoryEntries = [];
    
    for (const knife of starterKnivesFromDb) {
      const condition = 'Field-Tested'; // Give them decent condition starter knives
      const floatValue = 0.25 + Math.random() * 0.15; // Random float between 0.25-0.40 (Field-Tested range)
      
      // Get the actual market price for this specific knife
      const marketPrice = await getKnifeMarketPrice(
        knife.itemType, 
        knife.finishName, 
        condition, 
        knife.statTrak
      );
      
      const inventoryEntry = await prisma.userInventory.create({
        data: {
          userId: userId,
          knifeId: knife.id,
          condition: condition,
          floatValue: floatValue,
          price: marketPrice, // Use actual market price instead of random
          isForTrade: true, // Make them available for trading
          acquiredAt: new Date()
        }
      });
      
      inventoryEntries.push(inventoryEntry);
    }

    console.log(`✅ Added ${inventoryEntries.length} starter knives to user ${userId}`);
    return inventoryEntries;
    
  } catch (error) {
    console.error('Error adding starter knives to user:', error);
    throw error;
  }
}

// Function to get a user's inventory with knife details
export async function getUserInventoryWithKnives(userId) {
  try {
    const inventory = await prisma.userInventory.findMany({
      where: {
        userId: userId
      },
      include: {
        knife: true // Include full knife details
      },
      orderBy: {
        acquiredAt: 'desc'
      }
    });

    return inventory;
  } catch (error) {
    console.error('Error fetching user inventory:', error);
    throw error;
  }
}
