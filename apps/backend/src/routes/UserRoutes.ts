import { Router } from 'express';
import { userController } from '@controllers/userController.ts';

const router = Router();

router.get('/', userController.getAllusers);
router.get('/:id', userController.getUserById);
router.post('/register', userController.registerUser);
router.delete('/:id', userController.deleteUser);
//TODO : update user

export default router;