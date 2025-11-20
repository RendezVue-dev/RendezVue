import express from 'express'
import EventParticipationController from "../controllers/eventParticipation.js"

const router = express.Router();

router.get('/all', EventParticipationController.getAllEventParticipations);
    
router.get('/:id', EventParticipationController.getEventParticipationByUserId);

router.post('/', EventParticipationController.createEventParticipation);

router.delete('/', EventParticipationController.deleteEventParticipation);

export default router;