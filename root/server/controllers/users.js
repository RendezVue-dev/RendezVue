import { pool } from "../config/database.js";
import MatchService from '../services/matchService.js'
import InsightService from '../services/insightService.js'
import FormatCurrentDateTimeService from '../services/formatCurrentTimeService.js'

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
        const currentTime = FormatCurrentDateTimeService.formatCurrentDateTime();
        const results = await pool.query(`
            INSERT INTO users (first_name, last_name, username, age, city, state, zipcode, bio, created_at, modified_at)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [first_name, last_name, username, age, city, state, zipcode, bio || null, currentTime, currentTime]
        );
        await MatchService.generateMatches(Number(results.rows[0].id));
        await InsightService.createInsightForNewUser(Number(results.rows[0].id));
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
        const currentTime = FormatCurrentDateTimeService.formatCurrentDateTime();
        const { first_name, last_name, username, age, city, state, zipcode, bio } = req.body;
        const results = await pool.query(`
            UPDATE users SET first_name = $1, last_name = $2, username = $3, age = $4, city = $5, state = $6, zipcode = $7, bio = $8, modified_at = $9 WHERE id = $10`,
            [first_name, last_name, username, age, city, state, zipcode, bio || null, currentTime, userId]
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