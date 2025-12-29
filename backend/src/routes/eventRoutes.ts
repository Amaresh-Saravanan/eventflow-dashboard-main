import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';
import { verifyClerkToken } from '../middleware/clerkMiddleware';

const router = express.Router();

router.get('/', verifyClerkToken, getEvents);
router.get('/:id', verifyClerkToken, getEventById);
router.post('/', verifyClerkToken, createEvent);
router.put('/:id', verifyClerkToken, updateEvent);
router.delete('/:id', verifyClerkToken, deleteEvent);

export default router;