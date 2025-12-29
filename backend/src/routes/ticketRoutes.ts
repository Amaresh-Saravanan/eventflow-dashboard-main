import express from 'express';
import { Request, Response } from 'express';
import prisma from '../config/database';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get user's tickets
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            location: true,
            coverImage: true,
          },
        },
      },
      orderBy: { purchasedAt: 'desc' },
    });

    res.json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});

// Purchase ticket
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, quantity } = req.body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check capacity
    const soldTickets = event._count.tickets;
    if (soldTickets + quantity > event.capacity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const totalPrice = event.price * quantity;
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        quantity,
        totalPrice,
        userId: req.user.id,
        eventId,
        status: 'CONFIRMED',
      },
      include: {
        event: true,
      },
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Purchase ticket error:', error);
    res.status(500).json({ message: 'Failed to purchase ticket' });
  }
});

// Get ticket by ID
router.get('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: {
        event: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Failed to fetch ticket' });
  }
});

// Cancel ticket
router.patch('/:id/cancel', protect, async (req: AuthRequest, res: Response) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (ticket.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Ticket already cancelled' });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error('Cancel ticket error:', error);
    res.status(500).json({ message: 'Failed to cancel ticket' });
  }
});

export default router;
