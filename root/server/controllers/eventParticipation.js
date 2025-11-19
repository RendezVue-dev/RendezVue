import { pool } from "../config/database.js";
import FormatCurrentDateTimeService from "../services/formatCurrentTimeService.js";
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

//GET eventParticipation/:id
const getEventParticipationByUserId = async (req, res) =>{
    try{
        const userId = req.params.id;
        const selectQuery = `
            SELECT *
            FROM event_participation
            WHERE user_id=$1`;
        const results = await pool.query(selectQuery, [userId]);
        res.status(200).json(results.rows);
    }
    catch(error){
        res.status(409).json( { error: error.message} );
    }   
};

//POST eventParticipation/
const createEventParticipation = async (req, res) =>{
    try{
        const { eventId, userId, host = false } = req.body;
        const currentTime = formatCurrentDateTime();
        const results = await pool.query(`
            INSERT INTO event_participation (event_id, user_id, role, registered_at)
            VALUES($1, $2, $3, $4)
            RETURNING *`,   
            [eventId, userId, host, currentTime]
        );
        await InsightService.updateInsights(userId);
        res.status(201).json(results.rows[0]);
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

//DELETE eventParticipation/
const deleteEventParticipation = async (req, res) => {
    try{
        const { userId, eventId} = req.body;
        const results = await pool.query('DELETE FROM event_participation WHERE user_id = $1 AND event_id = $2', [userId, eventId]
        );
        await InsightService.updateInsights(userId);
        res.status(200).json({ message: "Event participation deleted successfully" });
    }
    catch(error){
        res.status(409).json( { error: error.message } );
    }
}; 

export default { getEventParticipationByUserId, createEventParticipation, deleteEventParticipation};