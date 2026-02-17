import { Router } from 'express';
import type { Request, Response } from 'express';
import { User } from '@/src/models/UserModel.ts';
import { toUserResponseDTO } from '@/src/dto/UserDTO.ts';
import { asyncHandler } from '@middleware/asyncHandler.ts';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const users = await User.findAll();
    const usersDTO = users.map(user => toUserResponseDTO(user))
    
    res.status(200).json(usersDTO);
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(Number(req.params.id));

    res.json(toUserResponseDTO(user));
}));

router.post('/register', asyncHandler(async (req: Request, res: Response) => {
    const { user_name, password } = req.body;
    const newUser = await User.create(user_name, password);

    res.status(201).json(toUserResponseDTO(newUser));
}));

//todo
router.patch('/id', asyncHandler(async (req: Request, res: Response) => {
    
}));

router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    const user = await User.delete(Number(req.params.id));

    res.status(200).json([{
        "status": "success",
        ...toUserResponseDTO(user)
        }]
    );
}));

export default router;