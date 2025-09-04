import express from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { type, condition, finish, page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (type) where.knifeType = { contains: type, mode: 'insensitive' };
    if (condition) where.condition = condition;
    if (finish) where.finishName = { contains: finish, mode: 'insensitive' };

    const [knives, total] = await Promise.all([
      prisma.userInventory.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              username: true,
            }
          }
        }
      }),
      prisma.userInventory.count({ where })
    ]);

    res.json({
      knives,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Knives fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { knifeType, condition, finishName, isStatTrak } = req.body;

    const knife = await prisma.userInventory.create({
      data: {
        userId: req.user.userId,
        knifeType,
        condition,
        finishName,
        isStatTrak: isStatTrak || false,
      },
    });

    res.status(201).json(knife);
  } catch (error) {
    console.error('Create knife error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
