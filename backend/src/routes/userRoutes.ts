import express from 'express';
import { Request, Response } from 'express';
import prisma from '../config/database';
import { protect } from '../middleware/authMiddleware';
import bcrypt from 'bcryptjs';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get user profile
router.get('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
});

// Get user's organized events
router.get('/organized-events', protect, async (req: AuthRequest, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { organizerId: req.user.id },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(events);
  } catch (error) {
    console.error('Get organized events error:', error);
    res.status(500).json({ message: 'Failed to fetch organized events' });
  }
});

// Get user statistics
router.get('/stats', protect, async (req: AuthRequest, res: Response) => {
  try {
    const [ticketCount, organizedEventCount] = await Promise.all([
      prisma.ticket.count({ where: { userId: req.user.id } }),
      prisma.event.count({ where: { organizerId: req.user.id } }),
    ]);

    res.json({
      ticketsPurchased: ticketCount,
      eventsOrganized: organizedEventCount,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

export default router;
