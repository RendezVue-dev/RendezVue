import { pool } from "../config/database.js";
import MatchService from "../services/matchService.js";
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

//GET userHobby/all
const getAllUsersHobbies = async (req, res) => {
    try{
        const results = await pool.query('SELECT * FROM user_hobby');
        res.status(200).json(results.rows);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
} 


//GET userHobby/:id
const getAllUsersHobbiesByUserId = async (req, res) => {
    try{
        const userId = parseInt(req.params.id);
        const selectQuery = `
            SELECT uh.*, h.name, h.description, h.population
            FROM user_hobby uh
            JOIN hobbies h ON uh.hobby_id = h.id
            WHERE uh.user_id = $1
            ORDER BY h.name ASC`;
        const results = await pool.query(selectQuery, [userId]);
        res.status(200).json(results.rows);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}

//GET userHobby/
const getUserHobbyByUserIdAndHobbyId = async (req, res) =>{
    try{
        const {user_id, hobby_id} = req.body;
        const selectQuery = `
            SELECT COUNT(*)
            FROM user_hobby
            WHERE user_id = $1 AND hobby_id = $2`;
        const results = await pool.query(selectQuery, [user_id, hobby_id]);
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message} );
    }   
};

//POST userHobby/
const createUserHobby = async (req, res) =>{
    try{
        const { user_id, hobby_id } = req.body;
        
        // Check if the user-hobby relationship already exists
        const existingCheck = await pool.query(`
            SELECT COUNT(*) FROM user_hobby 
            WHERE user_id = $1 AND hobby_id = $2
        `, [user_id, hobby_id]);
        
        if (parseInt(existingCheck.rows[0].count) > 0) {
            return res.status(409).json({ error: "User already has this hobby" });
        }
        
        // Insert the user-hobby relationship
        const results = await pool.query(`
            INSERT INTO user_hobby (user_id, hobby_id)
            VALUES($1, $2)
            RETURNING *`,
            [user_id, hobby_id]
        );
        
        // Increment hobby population by 1
        await pool.query(`
            UPDATE hobbies 
            SET population = population + 1 
            WHERE id = $1
        `, [hobby_id]);
        
        await MatchService.updateMatchesData(user_id);
        await InsightService.updateInsights(user_id);
        res.status(201).json(results.rows[0]);
    }
    catch(error)
    {
        res.status(409).json( { error: error.message } );
    }
};

//DELETE userHobby/
const deleteUserHobby = async (req, res) => {
    try{
        const {user_id, hobby_id} = req.body;
        
        // Check if the user-hobby relationship exists
        const existingCheck = await pool.query(`
            SELECT COUNT(*) FROM user_hobby 
            WHERE user_id = $1 AND hobby_id = $2
        `, [user_id, hobby_id]);
        
        if (parseInt(existingCheck.rows[0].count) === 0) {
            return res.status(404).json({ error: "User hobby relationship not found" });
        }
        
        // Delete the user-hobby relationship
        await pool.query('DELETE FROM user_hobby WHERE user_id = $1 AND hobby_id = $2', [user_id, hobby_id]);
        
        // Decrement hobby population by 1 (but don't go below 0)
        await pool.query(`
            UPDATE hobbies 
            SET population = GREATEST(0, population - 1) 
            WHERE id = $1
        `, [hobby_id]);
        
        await MatchService.updateMatchesData(user_id);
        await InsightService.updateInsights(user_id);
        res.status(200).json({ message: "User hobby deleted successfully" });
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

export default {getAllUsersHobbies, getAllUsersHobbiesByUserId, getUserHobbyByUserIdAndHobbyId, createUserHobby, deleteUserHobby};