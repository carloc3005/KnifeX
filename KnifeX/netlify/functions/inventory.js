import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Helper function to verify JWT token
const verifyToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid authorization token provided');
  }
  
  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET);
};

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
    // Verify authentication
    const decoded = verifyToken(event.headers.authorization);
    const userId = decoded.userId;

    if (event.httpMethod === 'GET') {
      // Get user inventory
      const inventory = await prisma.userInventory.findMany({
        where: { userId },
        include: {
          knife: true,
        },
        orderBy: {
          acquiredAt: 'desc',
        },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(inventory),
      };
    }

    if (event.httpMethod === 'POST') {
      // Add to inventory
      const { knifeId, condition, floatValue, price } = JSON.parse(event.body);

      if (!knifeId || !condition) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Knife ID and condition are required' }),
        };
      }

      const inventoryItem = await prisma.userInventory.create({
        data: {
          userId,
          knifeId,
          condition,
          floatValue: floatValue || null,
          price: price || null,
        },
        include: {
          knife: true,
        },
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(inventoryItem),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };

  } catch (error) {
    console.error('Inventory function error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid token' }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
