import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { 
  getAllKnifePrices, 
  getKnifePrice, 
  getPricesByKnifeType, 
  updateKnifePrice, 
  getMarketStats 
} from './knifePriceService.js';
import { addStarterKnivesToUser, getUserInventoryWithKnives } from './starterInventoryService.js';
import { botInventory, processBotTrade } from './botTradingService.js';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://knife-campsvr9w-carlo-castillos-projects-1517593b.vercel.app'
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Session middleware (required for Passport)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production' 
    ? 'https://knife-campsvr9w-carlo-castillos-projects-1517593b.vercel.app/api/auth/google/callback'
    : 'http://localhost:5173/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { googleId: profile.id }
    });

    if (user) {
      return done(null, user);
    }

    // Check if user exists with same email
    user = await prisma.user.findUnique({
      where: { email: profile.emails[0].value }
    });

    if (user) {
      // Link Google account to existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: profile.id,
          provider: 'google',
          avatar: profile.photos[0]?.value
        }
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: profile.emails[0].value,
          username: profile.displayName || profile.emails[0].value.split('@')[0],
          googleId: profile.id,
          provider: 'google',
          avatar: profile.photos[0]?.value
        }
      });

      // Add starter knives to new user
      try {
        await addStarterKnivesToUser(user.id);
      } catch (error) {
        console.error('Error adding starter knives:', error);
      }
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        provider: true,
        createdAt: true
      }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

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

// Google OAuth Routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    // Generate JWT token for the authenticated user
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Redirect to frontend with token
    const redirectUrl = process.env.NODE_ENV === 'production'
      ? `https://knife-campsvr9w-carlo-castillos-projects-1517593b.vercel.app/auth/callback?token=${token}`
      : `http://localhost:5173/auth/callback?token=${token}`;
    
    res.redirect(redirectUrl);
  }
);

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
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
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        provider: 'local'
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      }
    });

    // Add starter knives to the new user
    try {
      await addStarterKnivesToUser(user.id);
    } catch (starterError) {
      console.error('Error adding starter knives:', starterError);
      // Continue with registration even if starter knives fail
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Profile Routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        steamId: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
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
    const inventory = await getUserInventoryWithKnives(req.user.userId);
    res.json(inventory);
  } catch (error) {
    console.error('Inventory fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/inventory/add', authenticateToken, async (req, res) => {
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

// Knives Routes
app.get('/api/knives', async (req, res) => {
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

app.post('/api/knives', authenticateToken, async (req, res) => {
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Inventory count route
app.get('/api/inventory/count', authenticateToken, async (req, res) => {
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

// Bot inventory route
app.get('/api/bot/inventory', async (req, res) => {
  try {
    const inventory = botInventory;
    res.json(inventory);
  } catch (error) {
    console.error('Bot inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bot trade route
app.post('/api/bot/trade', authenticateToken, async (req, res) => {
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

// Knife prices routes
app.get('/api/knife-prices', async (req, res) => {
  try {
    const prices = await getAllKnifePrices();
    res.json(prices);
  } catch (error) {
    console.error('Knife prices fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/knife-prices/stats', async (req, res) => {
  try {
    const stats = await getMarketStats();
    res.json(stats);
  } catch (error) {
    console.error('Market stats fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/knife-prices/:itemType', async (req, res) => {
  try {
    const { itemType } = req.params;
    const prices = await getPricesByKnifeType(itemType);
    res.json(prices);
  } catch (error) {
    console.error('Knife prices by type fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/knife-prices/:itemType/:finishName/:condition', async (req, res) => {
  try {
    const { itemType, finishName, condition } = req.params;
    
    // Decode URL-encoded parameters
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

app.put('/api/knife-prices/:id', authenticateToken, async (req, res) => {
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

export default app;
