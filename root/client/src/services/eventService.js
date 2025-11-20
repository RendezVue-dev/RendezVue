const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const getAllEvents = async () => {
  try {
    const response = await fetch(`${API_URL}/api/events`);
    if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service eventService getAllEvents error:', error);
    throw error;
  }
};

const getEventById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/events/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch event: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service eventService getEventById error:', error);
    throw error;
  }
};

const createEvent = async (eventData) => {
  try {
    const response = await fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    if (!response.ok) throw new Error(`Failed to create event: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service eventService createEvent error:', error);
    throw error;
  }
};

const updateEvent = async (id, eventData) => {
  try {
    const response = await fetch(`${API_URL}/api/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    if (!response.ok) throw new Error(`Failed to update event: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service eventService updateEvent error:', error);
    throw error;
  }
};

const deleteEvent = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/events/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete event: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service eventService deleteEvent error:', error);
    throw error;
  }
};

export const eventService = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };
export default eventService;
