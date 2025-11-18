import { pool } from "../config/database.js";
import FormatCurrentTimeService from "./formatCurrentTimeService.js"

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
        FormatCurrentTimeService.formatCurrentDateTime()
    ];

    const insertQuery = `
        INSERT INTO insights (user_id, total_matches, active_hobbies, events_joined, events_hosted, groups_joined, avg_compatibility_score, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `;

    try {
        await pool.query(insertQuery, values);
        console.log(`Insight created for user ${userId}`);
    } catch (err) {
        console.error("Error inserting insights", err);
    }
}

const updateInsights = async (user_id) => {
    if (!user_id) throw new Error("User ID is required");

    try {
        const hobbyCountRes = await pool.query(`
            SELECT COUNT(*) AS hobby_count FROM user_hobby WHERE user_id = $1`, [user_id]);

        const eventsJoinedRes = await pool.query(`
            SELECT COUNT(*) AS event_joined_count FROM event_participation WHERE user_id = $1`, [user_id]);

        const eventsHostedRes = await pool.query(`
            SELECT COUNT(*) AS event_hosted_count FROM events WHERE creator_id = $1`, [user_id]);

        const groupsJoinedRes = await pool.query(`
            SELECT COUNT(*) AS group_joined_count FROM group_member WHERE user_id = $1`, [user_id]);

        const totalMatchesRes = await pool.query(`
            SELECT COUNT(*) AS total_matches_count FROM matches WHERE (user1_id = $1 OR user2_id = $1) AND matched_at IS NOT NULL`, [user_id]);

        const avgCompatibilityScoreRes = await pool.query(`
            SELECT COALESCE(AVG(compatibility_score), 0) AS score FROM matches WHERE user1_id = $1 OR user2_id = $1`, [user_id]);

        await pool.query(`
            UPDATE insights SET
                total_matches = $2, active_hobbies = $3, events_joined = $4, events_hosted = $5, groups_joined = $6, avg_compatibility_score = $7, updated_at = $8 WHERE user_id = $1
        `, [user_id, parseInt(totalMatchesRes.rows[0].total_matches_count), parseInt(hobbyCountRes.rows[0].hobby_count), parseInt(eventsJoinedRes.rows[0].event_joined_count), parseInt(eventsHostedRes.rows[0].event_hosted_count), parseInt(groupsJoinedRes.rows[0].group_joined_count), parseFloat(avgCompatibilityScoreRes.rows[0].score), FormatCurrentTimeService.formatCurrentDateTime()]);
        console.log(`Insights updated for user ${user_id}`);
    } catch (err) {
        console.error("Failed updating insights", err);
    }
}
export default {createInsightForNewUser, updateInsights};
