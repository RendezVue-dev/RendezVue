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

//GET hobbies/
const getAllHobbies = async (req, res) => {
    try{
        const results = await pool.query('SELECT * FROM hobbies ORDER BY id ASC');
        res.status(200).json(results.rows);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
} 

//GET hobbies/:id
const getHobbyById = async (req, res) =>{
    try{
        const selectQuery = `
            SELECT name, description, population, created_at
            FROM hobbies
            WHERE id=$1`;
        const hobbyId = req.params.id;
        const results = await pool.query(selectQuery, [hobbyId]);
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message} );
    }   
};

//POST hobbies/
const createHobby = async (req, res) =>{
    try{
        const { name, description } = req.body;
        const population = 0; // Initialize population to 0 when hobby is created
        const currentTime = formatCurrentDateTime();
        const results = await pool.query(`
            INSERT INTO hobbies (name, description, population, created_at)
            VALUES($1, $2, $3, $4)
            RETURNING *`,
            [name, description, population, currentTime]
        );
        res.status(201).json(results.rows[0]);
    }
    catch(error)
    {
        res.status(409).json( { error: error.message } );
    }
};

//PATCH hobbies/:id
const updateHobby = async (req, res) => {
    try{
        const hobbyId = parseInt(req.params.id);
        const { name, description, population  } = req.body;
        const results = await pool.query(`
            UPDATE hobbies SET name = $1, description = $2, population = $3 WHERE id = $4`,
            [ name, description, population, hobbyId]
        );
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

//DELETE hobbies/:id
const deleteHobby = async (req, res) => {
    try{
        const hobbyId = parseInt(req.params.id);
        await pool.query('DELETE FROM hobbies WHERE id = $1', [hobbyId]);
        res.status(200).json({ message: "Hobby deleted successfully" });
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

export default {getAllHobbies, getHobbyById, createHobby, updateHobby, deleteHobby};