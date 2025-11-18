import { pool } from "../config/database.js";
import InsightService from "../services/insightService.js";
import FormatCurrentDateTimeService from "../services/formatCurrentTimeService.js";

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

//GET groups/
const getAllGroups = async (req, res) => {
    try{
        const results = await pool.query('SELECT * FROM groups ORDER BY id ASC');
        res.status(200).json(results.rows);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
} 

//GET groups/:id
const getGroupById = async (req, res) =>{
    try{
        const selectQuery = `
            SELECT name, description, hobby_id, num_members, created_by, created_at, modified_at
            FROM groups
            WHERE id=$1`;
        const groupId = req.params.id;
        const results = await pool.query(selectQuery, [groupId]);
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message} );
    }   
};

//POST groups/
const createGroup = async (req, res) =>{
    try{
        const { name, description, hobby_id, num_members, created_by } = req.body;
        const currentTime = formatCurrentDateTime();
        const results = await pool.query(`
            INSERT INTO groups (name, description, hobby_id, num_members, created_by, created_at, modified_at)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [name, description, hobby_id, num_members, created_by, currentTime, currentTime]
        );
        res.status(201).json(results.rows[0]);
    }
    catch(error)
    {
        res.status(409).json( { error: error.message } );
    }
};

//PATCH groups/:id
const updateGroup = async (req, res) => {
    try{
        const groupId = parseInt(req.params.id);
        const currentTime = FormatCurrentDateTimeService.formatCurrentDateTime();
        const { name, description, hobby_id, num_members, created_by } = req.body;
        const results = await pool.query(`
            UPDATE groups SET name = $1, description = $2, hobby_id = $3, num_members = $4, created_by = $5, modified_at = $6 WHERE id = $7`,
            [ name, description, hobby_id, num_members, created_by, currentTime, groupId]
        );
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

//DELETE groups/:id
const deleteGroup = async (req, res) => {
    try{
        const groupId = parseInt(req.params.id);
        const results = await pool.query('DELETE FROM groups WHERE id = $1', [groupId]
        );
        res.status(200).json({ message: "Group deleted successfully" });
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

export default {getAllGroups, getGroupById, createGroup, updateGroup, deleteGroup};