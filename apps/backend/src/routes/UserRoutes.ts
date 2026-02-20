import { Router } from 'express';
import { userController } from '@controllers/userController.ts';
import { protect } from '@middleware/authMiddleware.ts';

const router = Router();

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.get('/', protect, userController.getAllusers);
router.get('/:id', protect, userController.getUserById);
router.delete('/:id', protect, userController.deleteUser);
router.patch('/:id', protect, userController.updateUserPassword);

export default router;