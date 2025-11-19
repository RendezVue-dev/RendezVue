import express from 'express'
import GroupMemberController from "../controllers/groupMember.js"

const router = express.Router();
    
router.get('/', GroupMemberController.getAllGroupMembers);

router.get('/user/:userId', GroupMemberController.getGroupMemberByUserId);

router.get('/group/:groupId', GroupMemberController.getGroupMemberByGroupId);

router.post('/', GroupMemberController.createGroupMember);

router.patch('/:groupId/:userId', GroupMemberController.deleteGroupMember);

router.delete('/:groupId/:userId', GroupMemberController.deleteGroupMember);

export default router;