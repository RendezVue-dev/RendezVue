import { pool } from "../config/database.js";
import InsightService from "../services/insightService.js";

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

//GET matches/:id
const getMatchByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const selectQuery = `
            SELECT * FROM matches
            WHERE user1_id = $1 OR user2_id = $1 
        `;
        const results = await pool.query(selectQuery, [userId]);
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

//POST matches/
const createMatch = async (req, res) =>{
    try{
        const { user1_id, user2_id, hScore, proximity_miles, compatibility_score, suggested, match, matched_at } = req.body;
        const currentTime = formatCurrentDateTime();
        const results = await pool.query(`
            INSERT INTO matches (user1_id, user2_id, hScore, proximity_miles, compatibility_score, suggested, match, matched_at, last_updated)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [ user1_id, user2_id, hScore, proximity_miles, compatibility_score, suggested, match, matched_at || null, currentTime]
        );
        res.status(201).json(results.rows[0]);
    }
    catch(error)
    {
        res.status(409).json( { error: error.message } );
    }
};

//PATCH matches/pair/:user1_id/:user2_id
const updateMatch = async (req, res) => {
    try{
        let { user1_id, user2_id } = req.params;
        user1_id = parseInt(user1_id);
        user2_id = parseInt(user2_id);
        const [id1, id2] = user1_id < user2_id ? [user1_id, user2_id] : [user2_id, user1_id];
        const currentTime = formatCurrentDateTime();
        const { hScore, proximity_miles, compatibility_score, suggested, match, matched_at } = req.body;
        const results = await pool.query(`
            UPDATE matches SET hScore = $1, proximity_miles = $2, compatibility_score = $3, suggested = $4, match = $5, matched_at = $6, last_updated = $7 WHERE user1_id = $8 AND user2_id = $9`,
            [ hScore, proximity_miles, compatibility_score, suggested, match, matched_at || null, currentTime, id1, id2]
        );

        if (match === true) {
            await InsightService.updateInsights(user1_id);
            await InsightService.updateInsights(user2_id);
        }
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

//DELETE matches/pair/:user1_id/:user2_id
const deleteMatch = async (req, res) => {
    try{
        let { user1_id, user2_id } = req.params;
        user1_id = parseInt(user1_id);
        user2_id = parseInt(user2_id);
        const [id1, id2] = user1_id < user2_id ? [user1_id, user2_id] : [user2_id, user1_id];
        const selectQuery = `
            SELECT * FROM matches
            WHERE user1_id = $1 AND user2_id = $2
        `;
        const results = await pool.query(selectQuery, [id1, id2]);
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

export default { getMatchByUserId, createMatch, updateMatch, deleteMatch};