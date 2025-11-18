import express from 'express'
import InsightController from "../controllers/insights.js"

const router = express.Router();
    
router.get('/:id', InsightController.getInsightByUserId);

router.post('/', InsightController.createInsight);

router.patch('/:id', InsightController.updateInsight);

router.delete('/:id', InsightController.deleteInsights);

export default router;