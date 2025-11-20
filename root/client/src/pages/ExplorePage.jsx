import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import hobbyService from '../services/hobbyService';
import userHobbyService from '../services/userHobbyService';
import userService from '../services/userService';

const ExplorePage = () => {
  const { user: authUser } = useContext(AuthContext);
  const [hobbies, setHobbies] = useState([]);
  const [userHobbies, setUserHobbies] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHobby, setNewHobby] = useState({ name: '', description: '' });
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'population'
  const [processingHobby, setProcessingHobby] = useState(null); // Track which hobby is being processed

  const fetchHobbies = async () => {
    try {
      setLoading(true);
      const data = await hobbyService.getAllHobbies();
      if (data) {
        // Sort hobbies
        const sorted = [...data].sort((a, b) => {
          if (sortBy === 'population') {
            return b.population - a.population;
          }
          return a.name.localeCompare(b.name);
        });
        setHobbies(sorted);
      }
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (!authUser) {
      setCurrentUser(null);
      setUserHobbies([]);
      return;
    }

    try {
      // Get user ID from auth context or localStorage
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
        const userData = await userService.getUserById(userId);
        if (userData) {
          setCurrentUser(userData);
        }

        const hobbies = await userHobbyService.getUserHobbyById(userId);
        if (hobbies) {
          setUserHobbies(hobbies);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchHobbies();
    fetchUserData();
  }, [sortBy, authUser]);

  // Check if user is interested in a hobby
  const isInterested = (hobbyId) => {
    return userHobbies.some(uh => uh.hobby_id === hobbyId);
  };

  const handleCreateHobby = async (e) => {
    e.preventDefault();
    try {
      const created = await hobbyService.createHobby(newHobby);
      if (created) {
        setNewHobby({ name: '', description: '' });
        setShowCreateForm(false);
        fetchHobbies();
      }
    } catch (error) {
      setError(error.message || 'Failed to create hobby');
    }
  };

  const handleInterested = async (hobbyId) => {
    if (!currentUser || !currentUser.id) {
      setError('Please log in to express interest in hobbies');
      return;
    }

    try {
      setProcessingHobby(hobbyId);
      await userHobbyService.createUserHobby({
        user_id: currentUser.id,
        hobby_id: hobbyId
      });

      // Refresh data
      await fetchHobbies();
      await fetchUserData();
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to add interest');
    } finally {
      setProcessingHobby(null);
    }
  };

  const handleNotInterested = async (hobbyId) => {
    if (!currentUser || !currentUser.id) {
      setError('Please log in to manage your interests');
      return;
    }

    try {
      setProcessingHobby(hobbyId);
      await userHobbyService.deleteUserHobby({
        user_id: currentUser.id,
        hobby_id: hobbyId
      });

      // Refresh data
      await fetchHobbies();
      await fetchUserData();
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to remove interest');
    } finally {
      setProcessingHobby(null);
    }
  };

  if (loading && hobbies.length === 0) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="events-header">
          <h1>Explore Hobbies</h1>
          <p className="events-subtitle">
            Explore the hobbies of other users and express your interest in them. Or you can create a new hobby on your own!
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'right', marginBottom: '20px' }}>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {showCreateForm ? 'Cancel' : '+ Create New Hobby'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateHobby} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Create New Hobby</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Hobby Name *</label>
            <input
              type="text"
              value={newHobby.name}
              onChange={(e) => setNewHobby({ ...newHobby, name: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea
              value={newHobby.description}
              onChange={(e) => setNewHobby({ ...newHobby, description: e.target.value })}
              style={{ width: '100%', padding: '8px', fontSize: '16px', minHeight: '100px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Create Hobby
          </button>
        </form>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label>Sort by: </label>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '5px 10px', marginLeft: '10px' }}
        >
          <option value="name">Name</option>
          <option value="population">Population</option>
        </select>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>Error: {error.message || error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {hobbies.map((hobby) => {
          const interested = isInterested(hobby.id);
          const isProcessing = processingHobby === hobby.id;
          
          return (
            <div 
              key={hobby.id} 
              style={{ 
                border: interested ? '2px solid #fd5068' : '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '20px',
                boxShadow: interested ? '0 4px 12px rgba(253, 80, 104, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <h3 style={{ marginTop: 0 }}>{hobby.name}</h3>
              {hobby.description && (
                <p style={{ color: '#666', marginBottom: '10px' }}>{hobby.description}</p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '14px', color: '#888' }}>
                  <strong>{hobby.population || 0}</strong> {hobby.population === 1 ? 'person' : 'people'} interested
                </span>
              </div>
              
              {currentUser ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  {interested ? (
                    <button
                      onClick={() => handleNotInterested(hobby.id)}
                      disabled={isProcessing}
                      style={{
                        flex: 1,
                        padding: '10px 20px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        opacity: isProcessing ? 0.6 : 1,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(255, 68, 68, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isProcessing) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(255, 68, 68, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(255, 68, 68, 0.3)';
                      }}
                    >
                      {isProcessing ? 'Removing...' : 'Not Interested'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInterested(hobby.id)}
                      disabled={isProcessing}
                      style={{
                        flex: 1,
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #fd5068 0%, #ff8a80 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        opacity: isProcessing ? 0.6 : 1,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(253, 80, 104, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isProcessing) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(253, 80, 104, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(253, 80, 104, 0.3)';
                      }}
                    >
                      {isProcessing ? 'Adding...' : 'Interested'}
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <Link to="/login" style={{ color: '#fd5068', textDecoration: 'none', fontWeight: '600' }}>
                    Log in to express interest
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hobbies.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          No hobbies found. Create the first one!
        </p>
      )}
    </div>
  );
};

export default ExplorePage;
