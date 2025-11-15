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

//GET matches/
const getAllMatches = async (req, res) => {
    try{
        const results = await pool.query('SELECT * FROM matches');
        res.status(200).json(results.rows);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
} 

//GET matches/:id
const getMatchByUserPair = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

//POST matches/
const createMatch = async (req, res) =>{
    try{
        const { name, price, necklaceId, braceletId, ringId, earringId } = req.body;
        const currentTime = formatCurrentDateTime();
        const results = await pool.query(`
            INSERT INTO matches (user1_id, user2_id, shared_hobbies_count, proximity_km, interaction_count, compatibility_score, suggested, match, matched_at, last_updated)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [ name, price, necklaceId, braceletId, ringId, earringId, currentTime, currentTime]
        );
        res.status(201).json(results.rows[0]);
    }
    catch(error)
    {
        res.status(409).json( { error: error.message } );
    }
};

//PATCH matches/:id
const updateMatch = async (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const currentTime = formatCurrentDateTime();
        const { name, price, necklaceId, braceletId, ringId, earringId } = req.body;
        const results = await pool.query(`
            UPDATE jewelrySet SET name = $1, price = $2, necklaceId = $3, braceletId = $4, ringId = $5, earringId = $6, modifiedOn= $7 WHERE id = $8`,
            [ name, price, necklaceId, braceletId, ringId, earringId, currentTime, id]
        );
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

export default {getAllMatches, getMatchByUserPair, createJewelrySet, updateMatch, deleteMatch};