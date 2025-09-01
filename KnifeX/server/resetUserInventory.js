import { PrismaClient } from '@prisma/client';
import { addStarterKnivesToUser } from './starterInventoryService.js';

const prisma = new PrismaClient();

async function resetUserInventory(userIdentifier) {
  try {
    console.log('🔄 Starting inventory reset...');
    
    // Find the user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userIdentifier },
          { username: userIdentifier }
        ]
      }
    });

    if (!user) {
      console.error('❌ User not found:', userIdentifier);
      return;
    }

    console.log(`👤 Found user: ${user.username} (${user.email})`);

    // Clear current inventory
    console.log('🗑️ Clearing current inventory...');
    const deletedItems = await prisma.userInventory.deleteMany({
      where: {
        userId: user.id
      }
    });
    console.log(`✅ Deleted ${deletedItems.count} items from inventory`);

    // Add new starter knives
    console.log('🔪 Adding new starter knives...');
    const newKnives = await addStarterKnivesToUser(user.id);
    
    console.log('✅ Inventory reset complete!');
    console.log('🎁 New knives added:');
    
    // Fetch and display the new inventory
    const newInventory = await prisma.userInventory.findMany({
      where: {
        userId: user.id
      },
      include: {
        knife: true
      }
    });

    newInventory.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.knife.itemType} | ${item.knife.finishName}`);
      console.log(`     Condition: ${item.condition} | Float: ${item.floatValue.toFixed(4)} | Price: $${item.price.toFixed(2)}`);
      console.log(`     Available for trade: ${item.isForTrade ? 'Yes' : 'No'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error resetting inventory:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get user identifier from command line arguments
const userIdentifier = process.argv[2];

if (!userIdentifier) {
  console.log('Usage: node resetUserInventory.js <email_or_username>');
  console.log('Example: node resetUserInventory.js user@example.com');
  console.log('Example: node resetUserInventory.js myusername');
  process.exit(1);
}

resetUserInventory(userIdentifier);
