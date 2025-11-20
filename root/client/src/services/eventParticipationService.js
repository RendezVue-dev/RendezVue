const getAllEventParticipations = async () => {
    try {
        const response = await fetch("/api/eventParticipation/all");
        if (!response.ok) throw new Error(`Failed to fetch event participations: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service eventParticipationService getAllEventParticipations error:", error);
        return [];
    }
};

const getEventParticipationById = async (id) => {
    try {
        const response = await fetch(`/api/eventParticipation/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch event participation: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service eventParticipationService getEventParticipationById error:", error);
    }
};

const createEventParticipation = async (detail) => {
    try {
        const response = await fetch('/api/eventParticipation', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to create event participation: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service eventParticipationService createEventParticipation error:", error);
    }
};

const updateEventParticipation = async (id, detail) => {
    try {
        const response = await fetch(`/api/eventParticipation/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to update event participation: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service eventParticipationService updateEventParticipation error:", error);
    }
};

const deleteEventParticipation = async (detail) => {
    try {
        const response = await fetch('/api/eventParticipation', {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to delete event participation: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service eventParticipationService deleteEventParticipation error:", error);
    }
};

const getEventParticipants = async (eventId) => {
    try {
        // Get all participations and filter by eventId on client side
        // In a real app, you'd have a server endpoint for this
        const response = await fetch('/api/eventParticipation');
        if (!response.ok) throw new Error(`Failed to fetch event participations: ${response.status}`);
        const allParticipations = await response.json();
        return allParticipations.filter(p => p.event_id === eventId);
    } catch (error) {
        console.error("Service eventParticipationService getEventParticipants error:", error);
        return [];
    }
};

export const eventParticipationService = { 
  getAllEventParticipations, 
  getEventParticipationById, 
  createEventParticipation, 
  updateEventParticipation, 
  deleteEventParticipation,
  getEventParticipants
};
export default eventParticipationService;
