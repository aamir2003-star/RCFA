import express from 'express';
import { getUsers, getUserById, getPmTeam } from '../controllers/user.controller.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getUsers);
router.get('/team', getPmTeam);
router.get('/:id', getUserById);

export default router;
