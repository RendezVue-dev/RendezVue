import express from 'express'
import UserHobbyController from "../controllers/userHobby.js"

const router = express.Router();

router.get('/all', UserHobbyController.getAllUsersHobbies);
    
router.get('/:id', UserHobbyController.getAllUsersHobbiesByUserId);

router.get('/', UserHobbyController.getUserHobbyByUserIdAndHobbyId);

router.post('/:id', UserHobbyController.createUserHobby);

router.delete('/:id', UserHobbyController.deleteUserHobby);

export default router;