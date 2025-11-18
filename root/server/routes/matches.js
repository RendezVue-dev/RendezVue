import express from 'express'
import MatchesController from "../controllers/matches.js"

const router = express.Router();

router.get('/:id', MatchesController.getMatchByUserId);
    
router.post('/', MatchesController.createMatch);

router.patch('/pair/:user1_id/:user2_id', MatchesController.updateMatch);

router.delete('/pair/:user1_id/:user2_id', MatchesController.deleteMatch);

export default router;