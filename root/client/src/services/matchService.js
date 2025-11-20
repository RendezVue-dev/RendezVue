const getMatchesByUserId = async (userId) => {
  try {
    const response = await fetch(`/api/matches/${userId}`);
    if (!response.ok) throw new Error(`Failed to fetch matches: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service matchService getMatchesByUserId error:', error);
    throw error;
  }
};

const createMatch = async (matchData) => {
  try {
    const response = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData)
    });
    if (!response.ok) throw new Error(`Failed to create match: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service matchService createMatch error:', error);
    throw error;
  }
};

const updateMatch = async (user1Id, user2Id, matchData) => {
  try {
    const response = await fetch(`/api/matches/pair/${user1Id}/${user2Id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData)
    });
    if (!response.ok) throw new Error(`Failed to update match: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service matchService updateMatch error:', error);
    throw error;
  }
};

const deleteMatch = async (user1Id, user2Id) => {
  try {
    const response = await fetch(`/api/matches/pair/${user1Id}/${user2Id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete match: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Service matchService deleteMatch error:', error);
    throw error;
  }
};

export const matchService = { getMatchesByUserId, createMatch, updateMatch, deleteMatch };
export default matchService;
