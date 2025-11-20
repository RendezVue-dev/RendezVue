import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import eventService from '../services/eventService';
import hobbyService from '../services/hobbyService';
import eventParticipationService from '../services/eventParticipationService';
import userService from '../services/userService';
import './css/EventsPage.css';

const EventsPage = () => {
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventParticipants, setEventParticipants] = useState({});
  const [allParticipations, setAllParticipations] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'hosting'
  const [participantUsers, setParticipantUsers] = useState({}); // Cache user info

  const [newEvent, setNewEvent] = useState({
    hobby_id: '',
    title: '',
    description: '',
    venue_name: '',
    venue_street_address: '',
    venue_city: '',
    venue_state: '',
    venue_zip_code: '',
    start_time: '',
    capacity: ''
  });

  useEffect(() => {
    // Check authentication
    if (!authUser) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user ID
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
        }

        // Fetch all data
        const [eventsData, hobbiesData, participationsData] = await Promise.all([
          eventService.getAllEvents(),
          hobbyService.getAllHobbies(),
          eventParticipationService.getAllEventParticipations()
        ]);

        if (eventsData) setEvents(eventsData);
        if (hobbiesData) setHobbies(hobbiesData);
        if (participationsData) {
          setAllParticipations(participationsData);
          // Group participants by event ID
          const participantsByEvent = {};
          participationsData.forEach(part => {
            if (!participantsByEvent[part.event_id]) {
              participantsByEvent[part.event_id] = [];
            }
            participantsByEvent[part.event_id].push(part);
          });
          setEventParticipants(participantsByEvent);

          // Fetch user info for all participants
          const userIds = [...new Set(participationsData.map(p => p.user_id))];
          const usersMap = {};
          await Promise.all(
            userIds.map(async (userId) => {
              try {
                const user = await userService.getUserById(userId);
                if (user) {
                  usersMap[userId] = `${user.first_name} ${user.last_name} (${user.username})`;
                }
              } catch {
                usersMap[userId] = `User ${userId}`;
              }
            })
          );
          setParticipantUsers(usersMap);
        }

        setError(null);
      } catch (error) {
        setError(error.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser, navigate]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.id) {
      setError('User not found');
      return;
    }

    try {
      const eventData = {
        creator_id: currentUser.id,
        hobby_id: parseInt(newEvent.hobby_id),
        title: newEvent.title,
        description: newEvent.description || null,
        venue_name: newEvent.venue_name,
        venue_street_address: newEvent.venue_street_address,
        venue_city: newEvent.venue_city,
        venue_state: newEvent.venue_state,
        venue_zipcode: parseInt(newEvent.venue_zip_code),
        start_time: newEvent.start_time,
        capacity: newEvent.capacity ? parseInt(newEvent.capacity) : null
      };

      const created = await eventService.createEvent(eventData);
      if (created) {
        // Create participation record for the host
        await eventParticipationService.createEventParticipation({
          eventId: created.id,
          userId: currentUser.id,
          host: true
        });

        // Refresh data
        const [eventsData, participationsData] = await Promise.all([
          eventService.getAllEvents(),
          eventParticipationService.getAllEventParticipations()
        ]);
        if (eventsData) setEvents(eventsData);
        if (participationsData) {
          setAllParticipations(participationsData);
          const participantsByEvent = {};
          participationsData.forEach(part => {
            if (!participantsByEvent[part.event_id]) {
              participantsByEvent[part.event_id] = [];
            }
            participantsByEvent[part.event_id].push(part);
          });
          setEventParticipants(participantsByEvent);
        }

        setNewEvent({
          hobby_id: '',
          title: '',
          description: '',
          venue_name: '',
          venue_street_address: '',
          venue_city: '',
          venue_state: '',
          venue_zip_code: '',
          start_time: '',
          capacity: ''
        });
        setShowCreateForm(false);
        setError(null);
      }
    } catch (error) {
      setError(error.message || 'Failed to create event');
    }
  };

  const handleViewParticipants = async (eventId) => {
    if (eventParticipants[eventId]) {
      setSelectedEvent(eventId);
    } else {
      setSelectedEvent(eventId);
    }
  };

  const handleJoinEvent = async (eventId) => {
    if (!currentUser || !currentUser.id) {
      setError('User not found');
      return;
    }

    try {
      await eventParticipationService.createEventParticipation({
        eventId: eventId,
        userId: currentUser.id,
        host: false
      });

      // Refresh data
      const [eventsData, participationsData] = await Promise.all([
        eventService.getAllEvents(),
        eventParticipationService.getAllEventParticipations()
      ]);
      if (eventsData) setEvents(eventsData);
      if (participationsData) {
        setAllParticipations(participationsData);
        const participantsByEvent = {};
        participationsData.forEach(part => {
          if (!participantsByEvent[part.event_id]) {
            participantsByEvent[part.event_id] = [];
          }
          participantsByEvent[part.event_id].push(part);
        });
        setEventParticipants(participantsByEvent);
      }
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to join event');
    }
  };

  const handleLeaveEvent = async (eventId) => {
    if (!currentUser || !currentUser.id) {
      setError('User not found');
      return;
    }

    try {
      await eventParticipationService.deleteEventParticipation({
        eventId: eventId,
        userId: currentUser.id
      });

      // Refresh data
      const [eventsData, participationsData] = await Promise.all([
        eventService.getAllEvents(),
        eventParticipationService.getAllEventParticipations()
      ]);
      if (eventsData) setEvents(eventsData);
      if (participationsData) {
        setAllParticipations(participationsData);
        const participantsByEvent = {};
        participationsData.forEach(part => {
          if (!participantsByEvent[part.event_id]) {
            participantsByEvent[part.event_id] = [];
          }
          participantsByEvent[part.event_id].push(part);
        });
        setEventParticipants(participantsByEvent);
      }
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to leave event');
    }
  };

  const getUserInfo = (userId) => {
    return participantUsers[userId] || `User ${userId}`;
  };

  const getHobbyName = (hobbyId) => {
    const hobby = hobbies.find(h => h.id === hobbyId);
    return hobby ? hobby.name : `Hobby ${hobbyId}`;
  };

  const isUserParticipant = (eventId) => {
    const participants = eventParticipants[eventId] || [];
    return participants.some(p => p.user_id === currentUser?.id);
  };

  // Filter events based on view mode
  const filteredEvents = viewMode === 'hosting' 
    ? events.filter(e => e.creator_id === currentUser?.id)
    : events;

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  if (!authUser) {
    return null; // Will redirect
  }

  return (
    <div className="container events-container">
      <div className="events-header"> 
        <div className="events-header-content">
          <h1>Explore Events</h1>
          <p className="events-subtitle">
            Explore the events related to your hobbies. Or you can create a new event on your own!
          </p>
        </div>
      </div>
      <div className="events-header-actions" style ={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px'}}>
          <div className="view-mode-toggle">
            <button
              className={viewMode === 'all' ? 'active' : ''}
              onClick={() => setViewMode('all')}
            >
              All Events
            </button>
            <button
              className={viewMode === 'hosting' ? 'active' : ''}
              onClick={() => setViewMode('hosting')}
            >
              My Events
            </button>
          </div>
          <button
            className="create-event-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Create Event'}
          </button>
        </div>
      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <form onSubmit={handleCreateEvent} className="create-event-form">
          <h2>Create New Event</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hobby_id">Hobby *</label>
              <select
                id="hobby_id"
                value={newEvent.hobby_id}
                onChange={(e) => setNewEvent({ ...newEvent, hobby_id: e.target.value })}
                required
              >
                <option value="">Select a hobby</option>
                {hobbies.map(hobby => (
                  <option key={hobby.id} value={hobby.id}>{hobby.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title">Event Title *</label>
              <input
                type="text"
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="venue_name">Venue Name *</label>
              <input
                type="text"
                id="venue_name"
                value={newEvent.venue_name}
                onChange={(e) => setNewEvent({ ...newEvent, venue_name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="venue_street_address">Street Address *</label>
              <input
                type="text"
                id="venue_street_address"
                value={newEvent.venue_street_address}
                onChange={(e) => setNewEvent({ ...newEvent, venue_street_address: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="venue_city">City *</label>
              <input
                type="text"
                id="venue_city"
                value={newEvent.venue_city}
                onChange={(e) => setNewEvent({ ...newEvent, venue_city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="venue_state">State *</label>
              <input
                type="text"
                id="venue_state"
                value={newEvent.venue_state}
                onChange={(e) => setNewEvent({ ...newEvent, venue_state: e.target.value })}
                required
                maxLength="2"
                placeholder="CA"
              />
            </div>
            <div className="form-group">
              <label htmlFor="venue_zip_code">Zip Code *</label>
              <input
                type="number"
                id="venue_zip_code"
                value={newEvent.venue_zip_code}
                onChange={(e) => setNewEvent({ ...newEvent, venue_zip_code: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_time">Start Time *</label>
              <input
                type="datetime-local"
                id="start_time"
                value={newEvent.start_time}
                onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="capacity">Capacity</label>
              <input
                type="number"
                id="capacity"
                value={newEvent.capacity}
                onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                min="1"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">Create Event</button>
        </form>
      )}

      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>{viewMode === 'hosting' ? "You haven't created any events yet." : 'No events found.'}</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isHost = event.creator_id === currentUser?.id;
            const participants = eventParticipants[event.id] || [];
            const participantCount = participants.length;
            const hobby = hobbies.find(h => h.id === event.hobby_id);
            const isParticipant = isUserParticipant(event.id);
            const isFull = event.capacity !== null && participantCount >= event.capacity;
            const canJoin = !isHost && !isParticipant && !isFull;

            return (
              <div key={event.id} className={`event-card ${isHost ? 'host-event' : ''} ${isFull ? 'event-full' : ''}`}>
                <div className="event-header">
                  <div className="event-badge">
                    {isHost && <span className="host-badge">🎪 Hosting</span>}
                    {hobby && <span className="hobby-badge">{hobby.name}</span>}
                    {isFull && <span className="full-badge">🔒 Full</span>}
                  </div>
                </div>
                <h3 className="event-title">{event.title}</h3>
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
                <div className="event-details">
                  <div className="event-detail-item">
                    <span className="detail-icon">📅</span>
                    <span>{new Date(event.start_time).toLocaleString()}</span>
                  </div>
                  <div className="event-detail-item">
                    <span className="detail-icon">📍</span>
                    <span>{event.venue_name}, {event.venue_city}, {event.venue_state}</span>
                  </div>
                  <div className="event-detail-item">
                    <span className="detail-icon">👥</span>
                    <span>{participantCount} {participantCount === 1 ? 'attendee' : 'attendees'}</span>
                    {event.capacity && <span> / {event.capacity} max</span>}
                  </div>
                </div>
                <div className="event-actions">
                  {isHost ? (
                    <button
                      className="view-participants-btn"
                      onClick={() => handleViewParticipants(event.id)}
                    >
                      View Attendees ({participantCount})
                    </button>
                  ) : isParticipant ? (
                    <button
                      className="leave-event-btn"
                      onClick={() => handleLeaveEvent(event.id)}
                    >
                      Leave Event
                    </button>
                  ) : (
                    <button
                      className={`join-event-btn ${isFull ? 'disabled' : ''}`}
                      onClick={() => handleJoinEvent(event.id)}
                      disabled={isFull}
                    >
                      {isFull ? 'Event Full' : 'Join Event'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Event Attendees</h2>
              <button className="close-btn" onClick={() => setSelectedEvent(null)}>×</button>
            </div>
            <div className="participants-list">
              {eventParticipants[selectedEvent] && eventParticipants[selectedEvent].length > 0 ? (
                <>
                  <div className="participants-summary">
                    <span className="participants-count">
                      {eventParticipants[selectedEvent].length} {eventParticipants[selectedEvent].length === 1 ? 'attendee' : 'attendees'}
                    </span>
                    {events.find(e => e.id === selectedEvent)?.capacity && (
                      <span className="capacity-info">
                        / {events.find(e => e.id === selectedEvent).capacity} max
                      </span>
                    )}
                  </div>
                  <div className="participants-grid">
                    {eventParticipants[selectedEvent]
                      .sort((a, b) => {
                        // Sort hosts first, then by registration date
                        const aIsHost = a.role === true || a.host === true;
                        const bIsHost = b.role === true || b.host === true;
                        if (aIsHost && !bIsHost) return -1;
                        if (!aIsHost && bIsHost) return 1;
                        return new Date(a.registered_at) - new Date(b.registered_at);
                      })
                      .map((part, index) => {
                        const userInfo = getUserInfo(part.user_id);
                        const initials = userInfo.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                        const isHost = part.role === true || part.host === true;
                        return (
                          <div key={index} className={`participant-card ${isHost ? 'host-card' : ''}`}>
                            <div className="participant-avatar">
                              {initials}
                            </div>
                            <div className="participant-info">
                              <div className="participant-name">{userInfo}</div>
                              <div className="participant-meta">
                                <span className={`role-badge ${isHost ? 'host' : 'attendee'}`}>
                                  {isHost ? '🎪 Host' : '👤 Attendee'}
                                </span>
                                <span className="registered-time">
                                  {new Date(part.registered_at).toLocaleDateString()} at {new Date(part.registered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              ) : (
                <p className="no-participants">No attendees yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
