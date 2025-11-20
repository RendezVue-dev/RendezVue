import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';
import hobbyService from '../services/hobbyService';
import userHobbyService from '../services/userHobbyService';
import './css/ProfilePage.css';

const ProfilePage = () => {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [userHobbies, setUserHobbies] = useState([]);
  const [allHobbies, setAllHobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddHobby, setShowAddHobby] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user ID from auth context or localStorage
        let userId = null;
        if (authUser && authUser.id) {
          userId = authUser.id;
        } else {
          // Try to get from localStorage or use a default
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            userId = parsed.id;
          }
        }

        if (!userId) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        // Fetch user data
        const userData = await userService.getUserById(userId);
        if (userData) {
          setUser(userData);
        }

        // Fetch user's hobbies
        const hobbies = await userHobbyService.getUserHobbyById(userId);
        if (hobbies) {
          setUserHobbies(hobbies);
        }

        // Fetch all hobbies
        const allHobbiesData = await hobbyService.getAllHobbies();
        if (allHobbiesData) {
          setAllHobbies(allHobbiesData);
        }

        setError(null);
      } catch (error) {
        setError(error.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  const handleAddHobby = async (hobbyId) => {
    try {
      if (!user || !user.id) {
        setError('User not found');
        return;
      }

      await userHobbyService.createUserHobby({
        user_id: user.id,
        hobby_id: hobbyId
      });

      // Refresh user hobbies and all hobbies to update population
      const hobbies = await userHobbyService.getUserHobbyById(user.id);
      if (hobbies) {
        setUserHobbies(hobbies);
      }

      const allHobbiesData = await hobbyService.getAllHobbies();
      if (allHobbiesData) {
        setAllHobbies(allHobbiesData);
      }

      setShowAddHobby(false);
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to add hobby');
    }
  };

  const handleRemoveHobby = async (hobbyId) => {
    try {
      if (!user || !user.id) {
        setError('User not found');
        return;
      }

      await userHobbyService.deleteUserHobby({
        user_id: user.id,
        hobby_id: hobbyId
      });

      // Refresh user hobbies and all hobbies to update population
      const hobbies = await userHobbyService.getUserHobbyById(user.id);
      if (hobbies) {
        setUserHobbies(hobbies);
      }

      const allHobbiesData = await hobbyService.getAllHobbies();
      if (allHobbiesData) {
        setAllHobbies(allHobbiesData);
      }

      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to remove hobby');
    }
  };

  // Get hobbies that user doesn't have yet
  const availableHobbies = allHobbies.filter(
    hobby => !userHobbies.some(uh => uh.hobby_id === hobby.id)
  );

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  if (error && !user) {
    return <div className="container"><p>Error: {error}</p></div>;
  }

  if (!user) {
    return <div className="container"><p>No user found. Please log in.</p></div>;
  }

  return (
    <div className="container profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="personal-info-section">
        <div className="personal-info-header">
          <div className="user-avatar-large">
            {user.first_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="user-info-header">
            <h2 className="user-name-large">
              {user.first_name} {user.last_name}
            </h2>
            <p className="user-username-large">@{user.username}</p>
          </div>
        </div>

        <div className="personal-info-grid">
          {user.email && (
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">Age</span>
            <span className="info-value">{user.age} years old</span>
          </div>
          <div className="info-item">
            <span className="info-label">Location</span>
            <span className="info-value">
              {user.city}, {user.state} {user.zipcode}
            </span>
          </div>
          {user.bio && (
            <div className="bio-section">
              <div className="bio-label">Bio</div>
              <div className="bio-value">{user.bio}</div>
            </div>
          )}
        </div>
      </div>

      <div className="hobbies-section">
        <div className="hobbies-section-header">
          <h2>My Hobbies</h2>
          
        </div>

        {showAddHobby && availableHobbies.length === 0 && (
          <p className="no-hobbies-message">You've added all available hobbies!</p>
        )}

        {userHobbies.length > 0 ? (
          <div className="user-hobbies-grid">
            {userHobbies.map((userHobby) => (
              <div key={userHobby.hobby_id} className="user-hobby-card">
                <div className="user-hobby-info">
                  <h3 className="user-hobby-name">{userHobby.name}</h3>
                  <div className="user-hobby-population">
                    {userHobby.population || 0} {userHobby.population === 1 ? 'person' : 'people'} interested
                  </div>
                </div>
                <button 
                  className="remove-hobby-btn"
                  onClick={() => handleRemoveHobby(userHobby.hobby_id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-hobbies-message">
            No hobbies added yet. Click "Add Hobby" to get started!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
