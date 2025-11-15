import { pool } from "../config/database.js";

//helper function to format the timestamp
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

//GET users/
const getAllUsers = async (req, res) => {
    try{
        const results = await pool.query('SELECT * FROM users ORDER BY id ASC');
        res.status(200).json(results.rows);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
} 

//GET users/:id
const getUserById = async (req, res) =>{
    try{
        const selectQuery = `
            SELECT *
            FROM users
            WHERE id=$1`;
        const userId = req.params.id;
        const results = await pool.query(selectQuery, [userId]);
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message} );
    }   
};

//POST users/
const createUser = async (req, res) =>{
    try{
        const { first_name, last_name, username, age, city, state, zipcode, bio } = req.body;
        const currentTime = formatCurrentDateTime();
        const results = await pool.query(`
            INSERT INTO users (first_name, last_name, username, age, city, state, zipcode, bio, created_at, modified_at)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [first_name, last_name, username, age, city, state, zipcode, bio, currentTime, currentTime]
        );
        res.status(201).json(results.rows[0]);
    }
    catch(error)
    {
        res.status(409).json( { error: error.message } );
    }
};

//PATCH users/:id
const updateUser = async (req, res) => {
    try{
        const userId = parseInt(req.params.id);
        const currentTime = formatCurrentDateTime();
        const { first_name, last_name, username, age, city, state, zipcode, bio, modified_at } = req.body;
        const results = await pool.query(`
            UPDATE users SET first_name = $1, last_name = $2, username = $3, age = $4, city = $5, state = $6, zipcode = $7, bio = $8, modified_at = $9 WHERE id = $10`,
            [first_name, last_name, username, age, city, state, zipcode, bio, currentTime, userId]
        );
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

//DELETE users/:id
const deleteUser = async (req, res) => {
    try{
        const userId = parseInt(req.params.id);
        const results = await pool.query('DELETE FROM users WHERE id = $1', [userId]
        );
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

export default {getAllUsers, getUserById, createUser, updateUser, deleteUser};