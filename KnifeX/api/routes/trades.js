import express from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const trades = await prisma.trade.findMany({
      where: {
        OR: [
          { initiatorId: req.user.userId },
          { receiverId: req.user.userId }
        ]
      },
      include: {
        initiator: {
          select: { username: true }
        },
        receiver: {
          select: { username: true }
        },
        initiatorItems: true,
        receiverItems: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(trades);
  } catch (error) {
    console.error('Trades fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
