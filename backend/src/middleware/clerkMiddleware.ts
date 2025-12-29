import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import prisma from '../config/database';

interface AuthRequest extends Request {
  user?: any;
}

export const verifyClerkToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify Clerk JWT token
    const payload = await clerkClient.verifyToken(token);
    
    if (!payload || !payload.sub) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Get user from Clerk
    const clerkUser = await clerkClient.users.getUser(payload.sub);
    
    // Find or create user in your database
    let user = await prisma.user.findUnique({
      where: { email: clerkUser.emailAddresses[0].emailAddress }
    });

    if (!user) {
      // Auto-create user from Clerk
      user = await prisma.user.create({
        data: {
          email: clerkUser.emailAddresses[0].emailAddress,
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          password: '', // Not needed with Clerk
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Clerk auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};