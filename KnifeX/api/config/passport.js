import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { addStarterKnivesToUser } from '../../server/starterInventoryService.js';

const prisma = new PrismaClient();

export default function(passport) {
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
}
