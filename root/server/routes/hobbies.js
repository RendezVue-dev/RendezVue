import express from 'express'
import HobbyController from "../controllers/hobbies.js"

const router = express.Router();

router.get('/', HobbyController.getAllHobbies);
    
router.get('/:id', HobbyController.getHobbyById);

router.post('/', HobbyController.createHobby);

router.patch('/:id', HobbyController.updateHobby);

router.delete('/:id', HobbyController.deleteHobby);

export default router;