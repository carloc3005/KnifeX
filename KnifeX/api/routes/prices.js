import express from 'express';
import { 
  getAllKnifePrices, 
  getKnifePrice, 
  getPricesByKnifeType, 
  updateKnifePrice, 
  getMarketStats 
} from '../knifePriceService.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const prices = await getAllKnifePrices();
    res.json(prices);
  } catch (error) {
    console.error('Knife prices fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await getMarketStats();
    res.json(stats);
  } catch (error) {
    console.error('Market stats fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:itemType', async (req, res) => {
  try {
    const { itemType } = req.params;
    const prices = await getPricesByKnifeType(itemType);
    res.json(prices);
  } catch (error) {
    console.error('Knife prices by type fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:itemType/:finishName/:condition', async (req, res) => {
  try {
    const { itemType, finishName, condition } = req.params;
    
    const decodedItemType = decodeURIComponent(itemType);
    const decodedFinishName = decodeURIComponent(finishName);
    const decodedCondition = decodeURIComponent(condition);
    
    const price = await getKnifePrice(decodedItemType, decodedFinishName, decodedCondition);
    
    if (price) {
      res.json(price);
    } else {
      res.status(404).json({ error: 'Price not found' });
    }
  } catch (error) {
    console.error('Specific knife price fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { steamPrice, csmoneySellPrice, csmoneySellPriceDelta } = req.body;

    const updatedPrice = await updateKnifePrice(id, {
      steamPrice,
      csmoneySellPrice,
      csmoneySellPriceDelta
    });

    if (updatedPrice) {
      res.json(updatedPrice);
    } else {
      res.status(404).json({ error: 'Price record not found' });
    }
  } catch (error) {
    console.error('Update knife price error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
