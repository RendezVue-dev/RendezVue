const getAllUserHobbies = async () => {
    try {
        const response = await fetch("/api/userHobby");
        if (!response.ok) throw new Error(`Failed to fetch user hobbies: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service userHobbyService getAllUserHobbies error:", error);
    }
};

const getUserHobbyById = async (id) => {
    try {
        const response = await fetch(`/api/userHobby/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch user hobby: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service userHobbyService getUserHobbyById error:", error);
    }
};

const createUserHobby = async (detail) => {
    try {
        const response = await fetch('/api/userHobby', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to create user hobby: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service userHobbyService createUserHobby error:", error);
    }
};

const updateUserHobby = async (id, detail) => {
    try {
        const response = await fetch(`/api/userHobby/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to update user hobby: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service userHobbyService updateUserHobby error:", error);
    }
};

const deleteUserHobby = async (detail) => {
    try {
        const response = await fetch('/api/userHobby', {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to delete user hobby: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service userHobbyService deleteUserHobby error:", error);
    }
};

export const userHobbyService = { getAllUserHobbies, getUserHobbyById, createUserHobby, updateUserHobby, deleteUserHobby };
export default userHobbyService;
