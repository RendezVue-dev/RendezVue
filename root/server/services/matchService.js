import { pool } from "../config/database.js";
import Haversine from "../utils/distance.js"
import HobbyScore from "../utils/hobbyScore.js"

const formatCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const calculateCompatibilityScore = (hobbyScore, distanceMiles) => {
    const distanceScore = 1 / (1 + distanceKm);

    // weighted compatibility
    const compatibilit = 0.4 * hobbyScore + 0.6 * distanceMiles;
};

const generateMatchesDataForNewUser = async (newUser) => {
    const locRes = await pool.query(
        "SELECT latitude, longitude FROM zipcodes WHERE zipcode = $1",
        [newUser.zipcode]
    );
    
    if (locRes.rows.length === 0) return;

    const { latitude: lat_user, longitude: long_user } = locRes.rows[0];

    const otherUsersLocation = await pool.query(`
        SELECT u.id, z.lat, z.long
        FROM users u
        JOIN zipcodes z ON u.zipcode = z.zipcode
        WHERE u.id != $1
    `, [newUser.id]);

    for (let other of usersRes.rows) {
        const distance = Haversine.haversine
        (
            lat_user,
            long_user,
            other.lat,
            other.long
        );

        const hScore = HobbyScore.hobbyScore(newUser.id, other.id);
        const currentTime = formatCurrentDateTime();
        const compatibilityScore = calculateCompatibilityScore(hScore, distance);

        await pool.query(
            `
            INSERT INTO matches (user1_id, user2_id, hScore, proximity_miles, compatibility_score, suggested, match, matched_at, last_updated)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `, [newUser.id, other.id, hScore, distance, compatibilityScore, compatibilityScore >= 0.5 ? true : false, null, currentTime]
        );
    }
    }
    
    export default {generateMatchesDataForNewUser};
