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

//GET events/
const getAllEvents = async (req, res) => {
    try{
        const results = await pool.query('SELECT * FROM events ORDER BY id ASC');
        res.status(200).json(results.rows);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
} 

//GET events/:id
const getEventById = async (req, res) =>{
    try{
        const selectQuery = `
            SELECT creator_id, hobby_id, title, description, venue_name, venue_street_address, venue_city, venue_state, venue_zip_code, start_time, capacity, created_at, modified_at
            FROM events
            WHERE id=$1`;
        const eventId = req.params.id;
        const results = await pool.query(selectQuery, [eventId]);
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message} );
    }   
};

//POST events/
const createEvent = async (req, res) =>{
    try{
        const { creator_id, hobby_id, title, description, venue_name, venue_street_address, venue_city, venue_state, venue_zip_code, start_time, capacity } = req.body;
        const currentTime = formatCurrentDateTime();
        const results = await pool.query(`
            INSERT INTO events (creator_id, hobby_id, title, description, venue_name, venue_street_address, venue_city, venue_state, venue_zip_code, start_time, capacity, created_at, modified_at)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [creator_id, hobby_id, title, description, venue_name, venue_street_address, venue_city, venue_state, venue_zip_code, start_time, capacity, currentTime, currentTime]
        );
        res.status(201).json(results.rows[0]);
    }
    catch(error)
    {
        res.status(409).json( { error: error.message } );
    }
};

//PATCH events/:id
const updateEvent = async (req, res) => {
    try{
        const eventId = parseInt(req.params.id);
        const currentTime = formatCurrentDateTime();
        const { creator_id, hobby_id, title, description, venue_name, venue_street_address, venue_city, venue_state, venue_zip_code, start_time, capacity } = req.body;
        const results = await pool.query(`
            UPDATE events SET creator_id = $1, hobby_id = $2, title = $3, description = $4, venue_name = $5, venue_street_address = $6, venue_city = $7, venue_state = $8, venue_zip_code = $9, start_time = $10, capacity = $11 WHERE id = $12`,
            [creator_id, hobby_id, title, description, venue_name, venue_street_address, venue_city, venue_state, venue_zip_code, start_time, capacity, currentTime, eventId]
        );
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

//DELETE events/:id
const deleteEvent = async (req, res) => {
    try{
        const eventId = parseInt(req.params.id);
        const results = await pool.query('DELETE FROM events WHERE id = $1', [eventId]
        );
        res.status(200).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

export default { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent};