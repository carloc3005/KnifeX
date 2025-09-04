import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Parse query parameters
      const queryParams = event.queryStringParameters || {};
      const { page = 1, limit = 20, itemType, finishName, rarity } = queryParams;
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      // Build where clause
      const where = {};
      if (itemType) where.itemType = { contains: itemType, mode: 'insensitive' };
      if (finishName) where.finishName = { contains: finishName, mode: 'insensitive' };
      if (rarity) where.rarity = rarity;

      // Get knives with pagination
      const [knives, total] = await Promise.all([
        prisma.knife.findMany({
          where,
          skip,
          take,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.knife.count({ where }),
      ]);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          knives,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / take),
          },
        }),
      };
    }

    if (event.httpMethod === 'POST') {
      // Create new knife (admin functionality)
      const { itemType, finishName, imageUrl, quality, statTrak = false, rarity, caseSources = [] } = JSON.parse(event.body);

      if (!itemType || !finishName || !imageUrl || !quality || !rarity) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' }),
        };
      }

      // Check if knife already exists
      const existingKnife = await prisma.knife.findFirst({
        where: {
          itemType,
          finishName,
          statTrak,
        },
      });

      if (existingKnife) {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({ error: 'Knife with this combination already exists' }),
        };
      }

      const knife = await prisma.knife.create({
        data: {
          itemType,
          finishName,
          imageUrl,
          quality,
          statTrak,
          rarity,
          caseSources,
        },
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(knife),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };

  } catch (error) {
    console.error('Knives function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
