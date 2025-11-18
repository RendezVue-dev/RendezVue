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
            SELECT *
            FROM user_hobby
            WHERE user_id = $1`;
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
        const results = await pool.query(`
            INSERT INTO user_hobby (user_id, hobby_id)
            VALUES($1, $2)
            RETURNING *`,
            [user_id, hobby_id]
        );
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
        const results = await pool.query('DELETE FROM user_hobby WHERE user_id = $1 AND hobby_id = $2', [user_id, hobby_id]);
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

export default {getAllUsersHobbies, getAllUsersHobbiesByUserId, getUserHobbyByUserIdAndHobbyId, createUserHobby, deleteUserHobby};