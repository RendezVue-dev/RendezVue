const API_URL = import.meta.env.API_URL || "http://localhost:3000";
const getAllInsights = async () => {
    try {
        const response = await fetch(`${API_URL}/api/insights`);
        if (!response.ok) throw new Error(`Failed to fetch insights: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service insightService getAllInsights error:", error);
    }
};

const getInsightById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/insights/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch insight: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service insightService getInsightById error:", error);
    }
};

const createInsight = async (detail) => {
    try {
        const response = await fetch(`${API_URL}/api/insights`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to create insight: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service insightService createInsight error:", error);
    }
};

const updateInsight = async (id, detail) => {
    try {
        const response = await fetch(`${API_URL}/api/insights/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to update insight: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service insightService updateInsight error:", error);
    }
};

const deleteInsight = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/insights/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error(`Failed to delete insight: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service insightService deleteInsight error:", error);
    }
};

export const insightService = { getAllInsights, getInsightById, createInsight, updateInsight, deleteInsight };
export default insightService;
