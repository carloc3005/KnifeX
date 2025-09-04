import express from 'express';
import { botInventory, processBotTrade } from '../botTradingService.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/inventory', async (req, res) => {
  try {
    const inventory = botInventory;
    res.json(inventory);
  } catch (error) {
    console.error('Bot inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/trade', authenticateToken, async (req, res) => {
  try {
    const { userItemId, botItemId } = req.body;

    if (!userItemId || !botItemId) {
      return res.status(400).json({ error: 'User item ID and bot item ID are required' });
    }

    const result = await processBotTrade(req.user.userId, userItemId, botItemId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Bot trade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
