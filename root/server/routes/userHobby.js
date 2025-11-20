import express from 'express'
import UserHobbyController from "../controllers/userHobby.js"

const router = express.Router();

// Order matters: specific routes before parameterized routes
router.get('/all', UserHobbyController.getAllUsersHobbies);

router.post('/', UserHobbyController.createUserHobby);

router.delete('/', UserHobbyController.deleteUserHobby);

router.get('/', UserHobbyController.getUserHobbyByUserIdAndHobbyId);
    
router.get('/:id', UserHobbyController.getAllUsersHobbiesByUserId);

export default router;