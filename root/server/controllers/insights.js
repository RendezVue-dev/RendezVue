import { pool } from "../config/database.js";

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

//GET insights/:user_id
const getInsightByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const selectQuery = `
            SELECT * FROM insights
            WHERE user_id = $1 
        `;
        const results = await pool.query(selectQuery, [userId]);
        res.status(200).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

//POST insights/
const createInsight = async (req, res) =>{
    try{
        const { user_id, total_matches, active_hobbies, events_joined, events_hosted, groups_joined, avg_compatibility_score } = req.body;
        const currentTime = formatCurrentDateTime();
        const results = await pool.query(`
            INSERT INTO insights (user_id, total_matches, active_hobbies, events_joined, events_hosted, groups_joined, avg_compatibility_score, updated_at)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [ user_id, total_matches, active_hobbies, events_joined, events_hosted, groups_joined, avg_compatibility_score, currentTime]
        );
        res.status(201).json(results.rows[0]);
    }
    catch(error)
    {
        res.status(409).json( { error: error.message } );
    }
};

//PATCH insights/:id
const updateInsight = async (req, res) => {
    try{
        const userId = parseInt(req.params.id);
        const { total_matches, active_hobbies, events_joined, events_hosted, groups_joined, avg_compatibility_score } = req.body;
        const currentTime = formatCurrentDateTime();
        const results = await pool.query(`
            UPDATE insights SET total_matches = $1, active_hobbies = $2, events_joined = $3, events_hosted = $4, groups_joined = $5, avg_compatibility_score = $6, updated_at = $7 WHERE user_id = $8`,
            [ total_matches, active_hobbies, events_joined, events_hosted, groups_joined, avg_compatibility_score, currentTime, userId ]
        );
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

//DELETE insights/:id
const deleteInsights = async (req, res) => {
    try{
        const userId = parseInt(req.params.id);
        const selectQuery = `
            DELETE FROM insights WHERE user_id = $1
        `;
        const results = await pool.query(selectQuery, [userId]);
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

export default {getInsightByUserId, createInsight, updateInsight, deleteInsights};