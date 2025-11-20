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

//GET eventParticipation/all
const getAllEventParticipations = async (req, res) => {
    try {
        const selectQuery = `SELECT * FROM event_participation ORDER BY registered_at DESC`;
        const results = await pool.query(selectQuery);
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

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
        
        // Check if user is already registered
        const existingCheck = await pool.query(
            'SELECT * FROM event_participation WHERE event_id = $1 AND user_id = $2',
            [eventId, userId]
        );
        if (existingCheck.rows.length > 0) {
            return res.status(409).json({ error: 'User is already registered for this event' });
        }

        // If not a host, check capacity
        if (!host) {
            const eventCheck = await pool.query(
                'SELECT capacity FROM events WHERE id = $1',
                [eventId]
            );
            
            if (eventCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Event not found' });
            }

            const event = eventCheck.rows[0];
            
            // If event has a capacity, check if it's reached
            if (event.capacity !== null) {
                const participantCount = await pool.query(
                    'SELECT COUNT(*) as count FROM event_participation WHERE event_id = $1',
                    [eventId]
                );
                
                const currentCount = parseInt(participantCount.rows[0].count);
                if (currentCount >= event.capacity) {
                    return res.status(409).json({ error: 'Event has reached its capacity limit' });
                }
            }
        }

        const currentTime = formatCurrentDateTime();
        const results = await pool.query(`
            INSERT INTO event_participation (event_id, user_id, host, registered_at)
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

export default { getAllEventParticipations, getEventParticipationByUserId, createEventParticipation, deleteEventParticipation};