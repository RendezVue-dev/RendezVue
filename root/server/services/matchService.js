import { pool } from "../config/database.js";
import Haversine from "../utils/distance.js"
import FormatCurrentTimeService from "./formatCurrentTimeService.js"
import HobbyScore from "../utils/hobbyScore.js"

const calculateCompatibilityScore = (hobbyScore, distanceMiles) => {
    const distanceScore = 1 / (1 + distanceMiles);

    // weighted compatibility
    const compatibilityScore = 0.4 * hobbyScore + 0.6 * distanceScore;
    return compatibilityScore;
};

const generateMatchesDataForNewUser = async (user_id) => {
    const locRes = await pool.query(
        "SELECT u.id, z.latitude, z.longitude FROM users u JOIN zipcodes z ON u.zipcode = z.zipcode WHERE u.id = $1;",
        [user_id]
    );
    
    if (locRes.rows.length === 0) return;

    const { latitude: lat_user, longitude: long_user } = locRes.rows[0];

    const otherUsersLocation = await pool.query(`
        SELECT u.id, z.latitude, z.longitude
        FROM users u
        JOIN zipcodes z ON u.zipcode = z.zipcode
        WHERE u.id != $1
    `, [user_id]);

    for (let other of otherUsersLocation.rows) {
        const distance = Haversine.haversine
        (
            lat_user,
            long_user,
            other.latitude,
            other.longitude
        );

        const hScore = await HobbyScore.hobbyScore(user_id, other.id);
        const currentTime = FormatCurrentTimeService.formatCurrentDateTime();
        const compatibilityScore = calculateCompatibilityScore(hScore, distance);

        await pool.query(
            `
            INSERT INTO matches (user1_id, user2_id, hScore, proximity_miles, compatibility_score, suggested, match, matched_at, last_updated)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            `, [user_id, other.id, hScore, distance, compatibilityScore, compatibilityScore >= 0.5 ? true : false, false, null, currentTime]
        );
    }
}
    
const updateMatchesData = async (user_id) => {
    const locRes = await pool.query(
        "SELECT u.id, z.latitude, z.longitude FROM users u JOIN zipcodes z ON u.zipcode = z.zipcode WHERE u.id = $1;",
        [user_id]
    );
    
    if (locRes.rows.length === 0) return;

    const { latitude: lat_user, longitude: long_user } = locRes.rows[0];

    const otherUsersLocation = await pool.query(`
        SELECT u.id, z.latitude, z.longitude
        FROM users u
        JOIN zipcodes z ON u.zipcode = z.zipcode
        WHERE u.id != $1
    `, [user_id]);

    try {
        for (let other of otherUsersLocation.rows) {
            const distance = Haversine.haversine
            (
                lat_user,
                long_user,
                other.latitude,
                other.longitude
            );

            const hScore = await HobbyScore.hobbyScore(user_id, other.id);
            const currentTime = FormatCurrentTimeService.formatCurrentDateTime();
            const compatibilityScore = calculateCompatibilityScore(hScore, distance);
            const [id1, id2] = user_id < other.id ? [user_id, other.id] : [other.id, user_id];

            await pool.query(
                `   UPDATE matches SET hScore = $3, proximity_miles = $4, compatibility_score = $5, suggested = $6, last_updated = $7 WHERE user1_id = $1 AND user2_id = $2 
                    RETURNING *
                `, [id1, id2, hScore, distance, compatibilityScore, compatibilityScore >= 0.5 ? true : false, currentTime]
            );
        }
        } catch (err) {
            console.error('Error updating match:', err);
        }
};

export default {generateMatchesDataForNewUser, updateMatchesData};
