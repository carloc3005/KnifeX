import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Quality mapping
const QUALITY_MAP = {
  'Covert Knife': 'Covert',
  'Classified Knife': 'Classified',
  'Restricted Knife': 'Restricted',
  'Mil‑Spec Grade Knife': 'Mil-Spec'
};

// Case sources mapping (from your knives.jsx file)
const KNIFE_CASE_SOURCES = {
  'Bayonet': ['CS:GO Weapon Case', 'CS:GO Weapon Case 2', 'CS:GO Weapon Case 3', 'Operation Bravo Case', 'Winter Offensive Case', 'eSports 2013 Case', 'eSports 2013 Winter Case', 'eSports 2014 Summer Case', 'Operation Phoenix Case', 'Operation Vanguard Case', 'Revolver Case'],
  'M9 Bayonet': ['CS:GO Weapon Case', 'Chroma Case', 'Chroma 2 Case', 'Chroma 3 Case', 'Gamma Case', 'Gamma 2 Case'],
  'Karambit': ['CS:GO Weapon Case', 'CS:GO Weapon Case 2', 'CS:GO Weapon Case 3', 'Operation Bravo Case', 'Winter Offensive Case', 'Chroma Case', 'Chroma 2 Case', 'Chroma 3 Case', 'Gamma Case', 'Gamma 2 Case', 'Revolver Case'],
  'Flip Knife': ['CS:GO Weapon Case', 'Operation Bravo Case', 'Winter Offensive Case', 'Chroma Case', 'Chroma 2 Case', 'Chroma 3 Case', 'Gamma Case', 'Gamma 2 Case', 'Revolver Case'],
  'Gut Knife': ['CS:GO Weapon Case', 'Operation Bravo Case', 'Winter Offensive Case', 'Chroma Case', 'Chroma 2 Case', 'Chroma 3 Case', 'Gamma Case', 'Gamma 2 Case', 'Revolver Case'],
  'Butterfly Knife': ['Operation Breakout Weapon Case', 'Spectrum Case', 'Spectrum 2 Case', 'Operation Riptide Case'],
  'Huntsman Knife': ['Huntsman Weapon Case', 'Spectrum Case', 'Spectrum 2 Case', 'Operation Riptide Case'],
  'Falchion Knife': ['Falchion Case', 'Spectrum Case', 'Spectrum 2 Case', 'Operation Riptide Case'],
  'Shadow Daggers': ['Shadow Case', 'Spectrum Case', 'Spectrum 2 Case', 'Operation Riptide Case'],
  'Bowie Knife': ['Operation Wildfire Case', 'Spectrum Case', 'Spectrum 2 Case', 'Operation Riptide Case'],
  'Navaja Knife': ['Horizon Case', 'Danger Zone Case', 'Prisma Case', 'Prisma 2 Case'],
  'Stiletto Knife': ['Horizon Case', 'Danger Zone Case', 'Prisma Case', 'Prisma 2 Case'],
  'Talon Knife': ['Horizon Case', 'Danger Zone Case', 'Prisma Case', 'Prisma 2 Case'],
  'Ursus Knife': ['Horizon Case', 'Danger Zone Case', 'Prisma Case', 'Prisma 2 Case'],
  'Classic Knife': ['CS20 Case'],
  'Nomad Knife': ['Horizon Case', 'Danger Zone Case', 'Prisma Case', 'Prisma 2 Case'],
  'Paracord Knife': ['Horizon Case', 'Danger Zone Case', 'Prisma Case', 'Prisma 2 Case'],
  'Survival Knife': ['Horizon Case', 'Danger Zone Case', 'Prisma Case', 'Prisma 2 Case'],
  'Skeleton Knife': ['Shattered Web Case', 'Operation Broken Fang Case'],
  'Kukri Knife': ['Kilowatt Case']
};

async function seedKnives() {
  try {
    console.log('Starting knife seeding...');

    // Get all knife image files
    const knivesPath = path.join(__dirname, '../src/assets/knives');
    
    if (!fs.existsSync(knivesPath)) {
      console.error('Knives assets directory not found at:', knivesPath);
      return;
    }

    const knifeTypes = fs.readdirSync(knivesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`Found ${knifeTypes.length} knife types:`, knifeTypes);

    let totalKnives = 0;

    for (const knifeType of knifeTypes) {
      const typePath = path.join(knivesPath, knifeType);
      const imageFiles = fs.readdirSync(typePath)
        .filter(file => file.endsWith('.png'));

      console.log(`Processing ${knifeType}: ${imageFiles.length} variations`);

      for (const imageFile of imageFiles) {
        // Parse knife data from filename
        const fileName = path.parse(imageFile).name;
        const parts = fileName.split('-');
        
        let itemType = knifeType.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        if (itemType === 'M9 Knife') itemType = 'M9 Bayonet';
        if (itemType === 'Sd Knife') itemType = 'Shadow Daggers';

        const finishName = parts.length > 1 
          ? parts.slice(1).join('-').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
          : parts[0].replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        // Generate random properties
        const qualities = ['Covert Knife', 'Classified Knife', 'Restricted Knife', 'Mil‑Spec Grade Knife'];
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        const rarity = QUALITY_MAP[quality] || 'Unknown';
        const statTrak = Math.random() > 0.7; // 30% chance for StatTrak
        
        // Get case sources
        const caseSources = KNIFE_CASE_SOURCES[itemType] || ['Unknown Case'];
        
        // Create image URL (you'll need to adjust this based on your actual file serving setup)
        const imageUrl = `/src/assets/knives/${knifeType}/${imageFile}`;

        try {
          // Check if knife already exists
          const existingKnife = await prisma.knife.findUnique({
            where: {
              itemType_finishName_statTrak: {
                itemType,
                finishName,
                statTrak
              }
            }
          });

          if (!existingKnife) {
            await prisma.knife.create({
              data: {
                itemType,
                finishName,
                imageUrl,
                quality,
                statTrak,
                rarity,
                caseSources
              }
            });
            totalKnives++;
          } else {
            console.log(`Knife already exists: ${itemType} ${finishName} ${statTrak ? '(StatTrak)' : ''}`);
          }
        } catch (error) {
          console.error(`Error creating knife ${itemType} ${finishName}:`, error.message);
        }
      }
    }

    console.log(`Seeding completed! Added ${totalKnives} knives to the database.`);
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Create a sample user and inventory if needed
async function seedSampleData() {
  try {
    console.log('Creating sample user and inventory...');
    
    // Check if sample user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@knifex.com' }
    });

    if (!existingUser) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('demo123', 10);
      
      const user = await prisma.user.create({
        data: {
          email: 'demo@knifex.com',
          username: 'DemoUser',
          password: hashedPassword
        }
      });

      // Add some sample knives to the user's inventory
      const sampleKnives = await prisma.knife.findMany({
        take: 5
      });

      for (const knife of sampleKnives) {
        const conditions = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const floatValue = Math.random();
        const price = Math.random() * 2000 + 100;

        await prisma.userInventory.create({
          data: {
            userId: user.id,
            knifeId: knife.id,
            condition,
            floatValue,
            price
          }
        });
      }

      console.log('Sample user created with demo inventory');
    } else {
      console.log('Sample user already exists');
    }
  } catch (error) {
    console.error('Sample data seeding error:', error);
  }
}

async function main() {
  await seedKnives();
  await seedSampleData();
}

main().catch(console.error);
