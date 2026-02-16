import { Router } from 'express';
import { User } from '#models/UserModel.js';
import { toUserResponseDTO } from '#dto/UserDTO.js';
import { asyncHandler } from '#middleware/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    const usersDTO = users.map(user => toUserResponseDTO(user))
    
    res.status(200).json(usersDTO);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const user = await User.findById(Number(req.params.id));

    res.json(toUserResponseDTO(user));
}));

router.post('/register', asyncHandler(async (req, res) => {
    const { user_name, password } = req.body;
    const newUser = await User.create(user_name, password);

    res.status(201).json(toUserResponseDTO(newUser));
}));

//todo
router.patch('/id', asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { user_name, password } = req.body;

    const updatedUser = await User.update
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    const user = await User.delete(Number(req.params.id));

    res.status(200).json([{
        "status": "success",
        ...toUserResponseDTO(user)
        }]
    );
}));

export default router;