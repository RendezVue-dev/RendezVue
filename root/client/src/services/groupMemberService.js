const getAllGroupMembers = async () => {
    try {
        const response = await fetch("/api/groupMembers");
        if (!response.ok) throw new Error(`Failed to fetch group members: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service groupMemberService getAllGroupMembers error:", error);
    }
};

const getGroupMemberById = async (userId) => {
    try {
        const response = await fetch(`/api/groupMembers/user/${userId}`);
        if (!response.ok) throw new Error(`Failed to fetch group member: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service groupMemberService getGroupMemberById error:", error);
        return [];
    }
};

const getGroupMembersByGroupId = async (groupId) => {
    try {
        const response = await fetch(`/api/groupMembers/group/${groupId}`);
        if (!response.ok) throw new Error(`Failed to fetch group members: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service groupMemberService getGroupMembersByGroupId error:", error);
        return [];
    }
};

const createGroupMember = async (detail) => {
    try {
        const response = await fetch('/api/groupMembers', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail)
        });
        if (!response.ok) throw new Error(`Failed to create group member: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service groupMemberService createGroupMember error:", error);
    }
};

const updateGroupMember = async (groupId, userId, admin) => {
    try {
        const response = await fetch(`/api/groupMembers/${groupId}/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ admin })
        });
        if (!response.ok) throw new Error(`Failed to update group member: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service groupMemberService updateGroupMember error:", error);
    }
};

const deleteGroupMember = async (groupId, userId) => {
    try {
        const response = await fetch(`/api/groupMembers/${groupId}/${userId}`, { method: "DELETE" });
        if (!response.ok) throw new Error(`Failed to delete group member: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Service groupMemberService deleteGroupMember error:", error);
    }
};

export const groupMemberService = { 
  getAllGroupMembers, 
  getGroupMemberById,
  getGroupMembersByGroupId, 
  createGroupMember, 
  updateGroupMember, 
  deleteGroupMember 
};
export default groupMemberService;
