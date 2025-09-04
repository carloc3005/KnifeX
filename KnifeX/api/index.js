import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import configurePassport from './config/passport.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import inventoryRoutes from './routes/inventory.js';
import knivesRoutes from './routes/knives.js';
import tradeRoutes from './routes/trades.js';
import priceRoutes from './routes/prices.js';
import botRoutes from './routes/bot.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://knife-campsvr9w-carlo-castillos-projects-1517593b.vercel.app'
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Session middleware
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
configurePassport(passport);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/knives', knivesRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/knife-prices', priceRoutes);
app.use('/api/bot', botRoutes);


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


export default app;
