import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all knife prices
export async function getAllKnifePrices() {
  try {
    const prices = await prisma.knifePrice.findMany({
      orderBy: [
        { itemType: 'asc' },
        { finishName: 'asc' },
        { condition: 'asc' }
      ]
    });
    return prices;
  } catch (error) {
    console.error('Error fetching knife prices:', error);
    throw error;
  }
}

// Get price for a specific knife
export async function getKnifePrice(itemType, finishName, condition, statTrak = false) {
  try {
    const price = await prisma.knifePrice.findUnique({
      where: {
        itemType_finishName_condition_statTrak: {
          itemType,
          finishName,
          condition,
          statTrak
        }
      }
    });
    return price;
  } catch (error) {
    console.error('Error fetching specific knife price:', error);
    throw error;
  }
}

// Get prices by knife type
export async function getPricesByKnifeType(itemType) {
  try {
    const prices = await prisma.knifePrice.findMany({
      where: {
        itemType: itemType
      },
      orderBy: [
        { finishName: 'asc' },
        { condition: 'asc' }
      ]
    });
    return prices;
  } catch (error) {
    console.error('Error fetching prices by knife type:', error);
    throw error;
  }
}

// Update knife price
export async function updateKnifePrice(id, priceData) {
  try {
    const updatedPrice = await prisma.knifePrice.update({
      where: { id },
      data: {
        ...priceData,
        lastUpdated: new Date()
      }
    });
    return updatedPrice;
  } catch (error) {
    console.error('Error updating knife price:', error);
    throw error;
  }
}

// Get market statistics
export async function getMarketStats() {
  try {
    const stats = await prisma.knifePrice.aggregate({
      _avg: {
        currentPrice: true,
        volume: true
      },
      _min: {
        currentPrice: true
      },
      _max: {
        currentPrice: true
      },
      _count: {
        id: true
      }
    });

    const trendingUp = await prisma.knifePrice.count({
      where: { trend: 'RISING' }
    });

    const trendingDown = await prisma.knifePrice.count({
      where: { trend: 'FALLING' }
    });

    return {
      totalKnives: stats._count.id,
      averagePrice: stats._avg.currentPrice,
      minPrice: stats._min.currentPrice,
      maxPrice: stats._max.currentPrice,
      averageVolume: stats._avg.volume,
      trendingUp,
      trendingDown
    };
  } catch (error) {
    console.error('Error fetching market stats:', error);
    throw error;
  }
}
