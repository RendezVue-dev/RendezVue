const API_URL = import.meta.env.API_URL || "http://localhost:3000";
const getAllUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/api/users`);
        if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service userService getAllUsers error:", error);
    }
};

const getUserById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch user: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service userService getUserById error:", error);
    }
};

const createUser = async (detail) => {
    try {
        const response = await fetch(`${API_URL}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to create user: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service userService createUser error:", error);
    }
};

const updateUser = async (id, detail) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to update user: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service userService updateUser error:", error);
    }
};

const deleteUser = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error(`Failed to delete user: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service userService deleteUser error:", error);
    }
};

export const userService = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
export default userService;
