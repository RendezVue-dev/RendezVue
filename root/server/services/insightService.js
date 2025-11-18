import { pool } from "../config/database.js";
import FormatCurrentTime from "formatCurrentTimeService.js"

const createInsightForNewUser = async (userId) => {
    if (!userId) throw new Error("User ID is required");

    const hobbiesRes = 0;

    const eventsJoinedRes = 0;

    const eventsHostedRes = 0;

    const groupsJoinedRes = 0;

    const totalMatchesRes = 0;

    const avgCompatibilityScoreRes = 0.0;
  

    const values = [
        userId,
        totalMatchesRes,
        hobbiesRes,
        eventsJoinedRes,
        eventsHostedRes,
        groupsJoinedRes,
        avgCompatibilityScoreRes,
        FormatCurrentTime.formatCurrentTime()
    ];

    const insertQuery = `
        INSERT INTO insights (
            (user_id, total_matches, active_hobbies, events_joined, events_hosted, groups_joined, avg_compatibility_score, updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `;

    try {
        await pool.query(insertQuery, values);
        console.log(`📊 Insight created for user ${userId}`);
    } catch (err) {
        console.error("❌ Error inserting insights", err);
    }
}

export default {createInsightForNewUser};
