import express from 'express'
import GroupController from "../controllers/groups.js"

const router = express.Router();

router.get('/', GroupController.getAllGroups);
    
router.get('/:id', GroupController.getGroupById);

router.post('/', GroupController.createGroup);

router.patch('/:id', GroupController.updateGroup);

router.delete('/:id', GroupController.deleteGroup);

export default router;