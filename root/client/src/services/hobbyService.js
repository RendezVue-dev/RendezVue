const API_URL = import.meta.env.API_URL || "http://localhost:3000";
const getAllHobbies = async () => {
    try {
        const response = await fetch(`${API_URL}/api/hobbies`);
        if (!response.ok) throw new Error(`Failed to fetch hobbies: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service hobbyService getAllHobbies error:", error);
    }
};

const getHobbyById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/hobbies/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch hobby: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service hobbyService getHobbyById error:", error);
    }
};

const createHobby = async (detail) => {
    try {
        const response = await fetch(`${API_URL}/api/hobbies`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to create hobby: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service hobbyService createHobby error:", error);
    }
};

const updateHobby = async (id, detail) => {
    try {
        const response = await fetch(`${API_URL}/api/hobbies/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to update hobby: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service hobbyService updateHobby error:", error);
    }
};

const deleteHobby = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/hobbies/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error(`Failed to delete hobby: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service hobbyService deleteHobby error:", error);
    }
};

export const hobbyService = { getAllHobbies, getHobbyById, createHobby, updateHobby, deleteHobby };
export default hobbyService;
