import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        steamId: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Inventory Routes
app.get('/api/inventory', authenticateToken, async (req, res) => {
  try {
    const inventory = await prisma.userInventory.findMany({
      where: { userId: req.user.userId },
      include: {
        knife: true
      },
      orderBy: { acquiredAt: 'desc' }
    });

    res.json(inventory);
  } catch (error) {
    console.error('Inventory fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/inventory/add', authenticateToken, async (req, res) => {
  try {
    const { knifeId, condition, floatValue, price } = req.body;

    // Check if knife exists
    const knife = await prisma.knife.findUnique({
      where: { id: knifeId }
    });

    if (!knife) {
      return res.status(404).json({ error: 'Knife not found' });
    }

    const inventoryItem = await prisma.userInventory.create({
      data: {
        userId: req.user.userId,
        knifeId,
        condition: condition || 'Factory New',
        floatValue,
        price
      },
      include: {
        knife: true
      }
    });

    res.status(201).json(inventoryItem);
  } catch (error) {
    console.error('Add to inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Knife Routes
app.get('/api/knives', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, itemType } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (search) {
      where.OR = [
        { itemType: { contains: search, mode: 'insensitive' } },
        { finishName: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (itemType && itemType !== 'All') {
      where.itemType = itemType;
    }

    const [knives, total] = await Promise.all([
      prisma.knife.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { itemType: 'asc' }
      }),
      prisma.knife.count({ where })
    ]);

    res.json({
      knives,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Knives fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/knives', authenticateToken, async (req, res) => {
  try {
    const { itemType, finishName, imageUrl, quality, statTrak, rarity, caseSources } = req.body;

    const knife = await prisma.knife.create({
      data: {
        itemType,
        finishName,
        imageUrl,
        quality,
        statTrak: statTrak || false,
        rarity,
        caseSources: caseSources || []
      }
    });

    res.status(201).json(knife);
  } catch (error) {
    console.error('Knife creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Trade Routes
app.get('/api/trades', authenticateToken, async (req, res) => {
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
          select: { id: true, username: true, avatar: true }
        },
        receiver: {
          select: { id: true, username: true, avatar: true }
        },
        tradeItems: {
          include: {
            knife: true,
            userInventory: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(trades);
  } catch (error) {
    console.error('Trades fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

export default app;
