import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Bot's inventory - simulated bot knives
export const botInventory = [
  {
    id: 'bot_1',
    itemType: 'Karambit',
    finishName: 'Doppler',
    condition: 'Factory New',
    statTrak: false,
    price: 850.50,
    rarity: 'Covert',
    floatValue: 0.02
  },
  {
    id: 'bot_2', 
    itemType: 'M9 Bayonet',
    finishName: 'Fade',
    condition: 'Factory New',
    statTrak: false,
    price: 650.00,
    rarity: 'Covert',
    floatValue: 0.01
  },
  {
    id: 'bot_3',
    itemType: 'Flip Knife',
    finishName: 'Tiger Tooth',
    condition: 'Minimal Wear',
    statTrak: true,
    price: 320.75,
    rarity: 'Covert',
    floatValue: 0.08
  },
  {
    id: 'bot_4',
    itemType: 'Huntsman Knife',
    finishName: 'Crimson Web',
    condition: 'Field-Tested',
    statTrak: false,
    price: 275.00,
    rarity: 'Covert',
    floatValue: 0.22
  },
  {
    id: 'bot_5',
    itemType: 'Gut Knife',
    finishName: 'Marble Fade',
    condition: 'Factory New',
    statTrak: false,
    price: 165.25,
    rarity: 'Covert',
    floatValue: 0.03
  },
  {
    id: 'bot_6',
    itemType: 'Karambit',
    finishName: 'Autotronic',
    condition: 'Minimal Wear',
    statTrak: true,
    price: 1150.00,
    rarity: 'Covert',
    floatValue: 0.07
  }
];

// Function to simulate bot trade decision
export function calculateBotTradeDecision(userKnifePrice, botKnifePrice) {
  // Modified to always accept trades
  console.log(`Trade request: User knife ($${userKnifePrice}) for Bot knife ($${botKnifePrice})`);
  console.log('Bot is configured to accept all trades!');
  
  return true; // Always accept trades
}

// Function to process a bot trade
export async function processBotTrade(userId, userInventoryId, botKnifeId) {
  try {
    // Get user's knife
    const userKnife = await prisma.userInventory.findFirst({
      where: {
        id: userInventoryId,
        userId: userId,
        isForTrade: true
      },
      include: {
        knife: true
      }
    });

    if (!userKnife) {
      throw new Error('Knife not found or not available for trade');
    }

    // Get bot's knife details
    const botKnife = botInventory.find(knife => knife.id === botKnifeId);
    if (!botKnife) {
      throw new Error('Bot knife not found');
    }

    // Calculate bot decision
    const tradeAccepted = calculateBotTradeDecision(userKnife.price || 0, botKnife.price);

    if (!tradeAccepted) {
      return {
        success: false,
        message: 'Bot declined the trade offer',
        reason: 'The bot thinks this trade is not favorable'
      };
    }

    // Create or find the bot knife in the database
    let botKnifeRecord = await prisma.knife.findFirst({
      where: {
        itemType: botKnife.itemType,
        finishName: botKnife.finishName,
        statTrak: botKnife.statTrak
      }
    });

    if (!botKnifeRecord) {
      // Create the knife record if it doesn't exist
      botKnifeRecord = await prisma.knife.create({
        data: {
          itemType: botKnife.itemType,
          finishName: botKnife.finishName,
          imageUrl: `/src/assets/knives/${botKnife.itemType}/${botKnife.itemType.toLowerCase()}-${botKnife.finishName.toLowerCase().replace(/\s+/g, '-')}.png`,
          quality: 'Covert Knife',
          statTrak: botKnife.statTrak,
          rarity: botKnife.rarity,
          caseSources: ['Bot Trading']
        }
      });
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Remove user's knife from inventory
      await tx.userInventory.delete({
        where: { id: userInventoryId }
      });

      // Add bot's knife to user's inventory
      const newKnife = await tx.userInventory.create({
        data: {
          userId: userId,
          knifeId: botKnifeRecord.id,
          condition: botKnife.condition,
          floatValue: botKnife.floatValue,
          price: botKnife.price,
          isForTrade: true,
          acquiredAt: new Date()
        },
        include: {
          knife: true
        }
      });

      return newKnife;
    });

    return {
      success: true,
      message: 'Trade completed successfully!',
      newKnife: result,
      tradedKnife: userKnife
    };

  } catch (error) {
    console.error('Error processing bot trade:', error);
    throw error;
  }
}
