import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import matchService from '../services/matchService';
import userService from '../services/userService';
import userHobbyService from '../services/userHobbyService';
import hobbyService from '../services/hobbyService';
import './css/MatchesPage.css';

const MatchesPage = () => {
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [userHobbies, setUserHobbies] = useState([]);
  const [allHobbies, setAllHobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('suggestions'); // 'suggestions' or 'matches'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [sortBy, setSortBy] = useState('proximity'); // 'proximity' or 'compatibility'

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        let userId = null;
        if (authUser && authUser.id) {
          userId = authUser.id;
        } else {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            userId = parsed.id;
          }
        }

        if (userId) {
          const [userData, matchesData, userHobbiesData, hobbiesData] = await Promise.all([
            userService.getUserById(userId),
            matchService.getMatchesByUserId(userId),
            userHobbyService.getUserHobbyById(userId),
            hobbyService.getAllHobbies()
          ]);

          if (userData) setCurrentUser(userData);
          if (hobbiesData) setAllHobbies(hobbiesData);
          if (userHobbiesData) setUserHobbies(userHobbiesData);

          if (matchesData) {
            // Filter suggested matches (suggested = true, match = false)
            const suggested = matchesData.filter(m => 
              m.suggested === true && m.match === false
            );

            // Filter matched users (match = true)
            const matched = matchesData.filter(m => m.match === true);

            // Get user details for suggested matches
            const suggestedWithUsers = await Promise.all(
              suggested.map(async (match) => {
                const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
                try {
                  const otherUser = await userService.getUserById(otherUserId);
                  const otherUserHobbies = await userHobbyService.getUserHobbyById(otherUserId);
                  
                  // Find shared hobbies
                  const currentUserHobbyIds = userHobbiesData.map(uh => uh.hobby_id);
                  const otherUserHobbyIds = otherUserHobbies ? otherUserHobbies.map(uh => uh.hobby_id) : [];
                  const sharedHobbyIds = currentUserHobbyIds.filter(id => otherUserHobbyIds.includes(id));
                  const sharedHobbies = sharedHobbyIds.map(id => {
                    const hobby = hobbiesData.find(h => h.id === id);
                    return hobby ? hobby.name : null;
                  }).filter(Boolean);

                  return {
                    ...match,
                    otherUser,
                    otherUserHobbies: otherUserHobbies || [],
                    sharedHobbies
                  };
                } catch {
                  return null;
                }
              })
            );

            // Get user details for matched users
            const matchedWithUsers = await Promise.all(
              matched.map(async (match) => {
                const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
                try {
                  const otherUser = await userService.getUserById(otherUserId);
                  return {
                    ...match,
                    otherUser
                  };
                } catch {
                  return null;
                }
              })
            );

            const filtered = suggestedWithUsers.filter(Boolean);
            // Sort suggestions
            const sorted = [...filtered].sort((a, b) => {
              if (sortBy === 'proximity') {
                return a.proximity_miles - b.proximity_miles;
              } else {
                return b.compatibility_score - a.compatibility_score;
              }
            });
            setSuggestedMatches(sorted);
            setMatchedUsers(matchedWithUsers.filter(Boolean));
          }
        }

        setError(null);
      } catch (error) {
        setError(error.message || 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser, navigate, sortBy]);

  const handleMatch = async (match) => {
    if (!currentUser || !currentUser.id || processing) return;

    try {
      setProcessing(true);
      const otherUserId = match.user1_id === currentUser.id ? match.user2_id : match.user1_id;
      const [id1, id2] = currentUser.id < otherUserId 
        ? [currentUser.id, otherUserId] 
        : [otherUserId, currentUser.id];

      // Format date to match server format: YYYY-MM-DD HH:MM:SS
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      await matchService.updateMatch(id1, id2, {
        hScore: match.hScore,
        proximity_miles: match.proximity_miles,
        compatibility_score: match.compatibility_score,
        suggested: match.suggested,
        match: true,
        matched_at: currentTime
      });

      // Remove from suggestions and add to matches
      setSuggestedMatches(prev => prev.filter(m => 
        !(m.user1_id === match.user1_id && m.user2_id === match.user2_id)
      ));
      
      const matchedUser = {
        ...match,
        match: true,
        matched_at: currentTime,
        otherUser: match.otherUser
      };
      setMatchedUsers(prev => [...prev, matchedUser]);
      setCurrentIndex(0);
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to match');
    } finally {
      setProcessing(false);
    }
  };

  const handlePass = async (match) => {
    if (!currentUser || !currentUser.id || processing) return;

    try {
      setProcessing(true);
      const otherUserId = match.user1_id === currentUser.id ? match.user2_id : match.user1_id;
      const [id1, id2] = currentUser.id < otherUserId 
        ? [currentUser.id, otherUserId] 
        : [otherUserId, currentUser.id];

      await matchService.updateMatch(id1, id2, {
        hScore: match.hScore,
        proximity_miles: match.proximity_miles,
        compatibility_score: match.compatibility_score,
        suggested: false,
        match: false,
        matched_at: null
      });

      // Remove from suggestions
      setSuggestedMatches(prev => prev.filter(m => 
        !(m.user1_id === match.user1_id && m.user2_id === match.user2_id)
      ));
      setCurrentIndex(0);
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to pass');
    } finally {
      setProcessing(false);
    }
  };

  const getCurrentSuggestion = () => {
    if (suggestedMatches.length === 0) return null;
    return suggestedMatches[currentIndex];
  };

  const nextSuggestion = () => {
    if (currentIndex < suggestedMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSuggestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading matches...</div>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  const currentSuggestion = getCurrentSuggestion();

  return (
    <div className="container matches-container">
      <div className="matches-header">
          <div className="matches-header-content">
            <h1>Explore matches</h1>
            <p className="matches-subtitle">
              Explore other users and match with them. 
            </p>
        </div>

      </div>
    <div className="matches-header-actions" style ={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px'}}>
    <div className="view-mode-toggle">
        <button
            className={viewMode === 'suggestions' ? 'active' : ''}
            onClick={() => setViewMode('suggestions')}
          >
            Suggestions ({suggestedMatches.length})
          </button>
          <button
            className={viewMode === 'matches' ? 'active' : ''}
            onClick={() => setViewMode('matches')}
          >
            Matches ({matchedUsers.length})
          </button>
        </div>
    </div>
      {error && <div className="error-message">{error}</div>}

      {viewMode === 'suggestions' ? (
        <div className="suggestions-view">
          {suggestedMatches.length === 0 ? (
            <div className="no-suggestions">
              <div className="no-suggestions-icon">💔</div>
              <h2>No more suggestions</h2>
              <p>Check back later for new matches!</p>
            </div>
          ) : (
            <>
              <div className="suggestions-controls">
                <div className="suggestion-counter">
                  {currentIndex + 1} of {suggestedMatches.length}
                </div>
                <div className="sort-controls">
                  <label>Sort by: </label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentIndex(0);
                    }}
                    className="sort-select"
                  >
                    <option value="proximity">Distance (Nearest First)</option>
                    <option value="compatibility">Compatibility (Highest First)</option>
                  </select>
                </div>
              </div>
              {currentSuggestion && (
                <div className="match-card" style={{"width": "100%"}}>
                  <div className="match-card-header">
                    <div className="compatibility-badge">
                      {Math.round(currentSuggestion.compatibility_score * 100)}% Compatible
                    </div>
                    <div className="distance-badge">
                      📍 {currentSuggestion.proximity_miles.toFixed(1)} miles away
                    </div>
                  </div>

                  <div className="match-card-body">
                    <div className="user-avatar">
                      {currentSuggestion.otherUser?.first_name?.[0] || '?'}
                    </div>
                    <h2 className="user-name">
                      {currentSuggestion.otherUser?.first_name} {currentSuggestion.otherUser?.last_name}
                    </h2>
                    <p className="user-username">@{currentSuggestion.otherUser?.username}</p>
                    
                    {currentSuggestion.otherUser?.age && (
                      <p className="user-age">Age: {currentSuggestion.otherUser.age}</p>
                    )}
                    
                    {currentSuggestion.otherUser?.city && currentSuggestion.otherUser?.state && (
                      <p className="user-location">
                        📍 {currentSuggestion.otherUser.city}, {currentSuggestion.otherUser.state}
                      </p>
                    )}

                    {currentSuggestion.otherUser?.bio && (
                      <p className="user-bio">{currentSuggestion.otherUser.bio}</p>
                    )}

                    <div className="match-stats">
                      <div className="stat-item">
                        <span className="stat-label">Compatibility Score</span>
                        <span className="stat-value">{(currentSuggestion.compatibility_score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Distance</span>
                        <span className="stat-value">{currentSuggestion.proximity_miles.toFixed(1)} mi</span>
                      </div>
                    </div>

                    {currentSuggestion.sharedHobbies && currentSuggestion.sharedHobbies.length > 0 && (
                      <div className="shared-hobbies">
                        <h3>🎯 Shared Hobbies ({currentSuggestion.sharedHobbies.length})</h3>
                        <div className="hobbies-list">
                          {currentSuggestion.sharedHobbies.map((hobby, idx) => (
                            <span key={idx} className="hobby-tag">{hobby}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="match-card-actions">
                    <button
                      className="pass-btn"
                      onClick={() => handlePass(currentSuggestion)}
                      disabled={processing}
                    >
                      ✕ Pass
                    </button>
                    <button
                      className="match-btn"
                      onClick={() => handleMatch(currentSuggestion)}
                      disabled={processing}
                    >
                      ❤️ Match
                    </button>
                  </div>

                  {suggestedMatches.length > 1 && (
                    <div className="card-navigation">
                      <button
                        className="nav-btn prev-btn"
                        onClick={prevSuggestion}
                        disabled={currentIndex === 0}
                      >
                        ← Previous
                      </button>
                      <button
                        className="nav-btn next-btn"
                        onClick={nextSuggestion}
                        disabled={currentIndex === suggestedMatches.length - 1}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="matches-view">
          {matchedUsers.length === 0 ? (
            <div className="no-matches">
              <div className="no-matches-icon">💕</div>
              <h2>No matches yet</h2>
              <p>Start matching with suggested users to see your matches here!</p>
            </div>
          ) : (
            <div className="matched-users-grid">
              {matchedUsers.map((match) => (
                <div key={`${match.user1_id}-${match.user2_id}`} className="matched-user-card">
                  <div className="matched-user-avatar">
                    {match.otherUser?.first_name?.[0] || '?'}
                  </div>
                  <h3 className="matched-user-name">
                    {match.otherUser?.first_name} {match.otherUser?.last_name}
                  </h3>
                  <p className="matched-user-username">@{match.otherUser?.username}</p>
                  {match.matched_at && (
                    <p className="matched-date">
                      Matched on {new Date(match.matched_at).toLocaleDateString()}
                    </p>
                  )}
                  <div className="matched-stats">
                    <span className="matched-compatibility">
                      {Math.round(match.compatibility_score * 100)}% Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;

