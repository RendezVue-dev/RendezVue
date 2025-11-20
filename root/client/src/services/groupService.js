const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const getAllGroups = async () => {
  try {
    const response = await fetch(`${API_URL}/api/groups`);
    if (!response.ok) throw new Error(`Failed to fetch groups: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service groupService getAllGroups error:', error);
    throw error;
  }
};

const getGroupById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/groups/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch group: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service groupService getGroupById error:', error);
    throw error;
  }
};

const createGroup = async (groupData) => {
  try {
    const response = await fetch(`${API_URL}/api/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupData)
    });
    if (!response.ok) throw new Error(`Failed to create group: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service groupService createGroup error:', error);
    throw error;
  }
};

const updateGroup = async (id, groupData) => {
  try {
    const response = await fetch(`${API_URL}/api/groups/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupData)
    });
    if (!response.ok) throw new Error(`Failed to update group: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service groupService updateGroup error:', error);
    throw error;
  }
};

const deleteGroup = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/groups/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete group: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service groupService deleteGroup error:', error);
    throw error;
  }
};

export const groupService = { getAllGroups, getGroupById, createGroup, updateGroup, deleteGroup };
export default groupService;
