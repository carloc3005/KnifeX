import express from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authenticateToken.js';
import { getUserInventoryWithKnives } from '../../server/starterInventoryService.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const inventory = await getUserInventoryWithKnives(req.user.userId);
    res.json(inventory);
  } catch (error) {
    console.error('Inventory fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { knifeType, condition, finishName, isStatTrak } = req.body;

    if (!knifeType || !condition) {
      return res.status(400).json({ error: 'Knife type and condition are required' });
    }

    const inventoryItem = await prisma.userInventory.create({
      data: {
        userId: req.user.userId,
        knifeType,
        condition,
        finishName: finishName || null,
        isStatTrak: isStatTrak || false,
      },
    });

    res.status(201).json({
      message: 'Knife added to inventory successfully',
      item: inventoryItem
    });
  } catch (error) {
    console.error('Add to inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/count', authenticateToken, async (req, res) => {
  try {
    const count = await prisma.userInventory.count({
      where: { userId: req.user.userId }
    });

    res.json({ count });
  } catch (error) {
    console.error('Inventory count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
