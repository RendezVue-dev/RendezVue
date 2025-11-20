import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import insightService from '../services/insightService';
import userService from '../services/userService';
import './css//MatchInsightsPage.css';

const MatchInsightsPage = () => {
  const { user: authUser } = useContext(AuthContext);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!authUser) {
        setError('Please log in to view your insights');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
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
          const data = await insightService.getInsightById(userId);
          if (data) {
            setInsights(data);
          }
        }
        setError(null);
      } catch (error) {
        setError(error.message || 'Failed to load insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [authUser]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="container">
        <h1>Match Insights</h1>
        <p>No insights available yet. Start matching to see your statistics!</p>
      </div>
    );
  }

  const insightCards = [
    {
      key: 'total_matches',
      label: 'Total Matches',
      value: insights.total_matches || 0,
      icon: '💕',
      description: 'People you\'ve matched with',
      color: 'pink'
    },
    {
      key: 'active_hobbies',
      label: 'Active Hobbies',
      value: insights.active_hobbies || 0,
      icon: '🎯',
      description: 'Hobbies you\'re currently interested in',
      color: 'orange'
    },
    {
      key: 'events_joined',
      label: 'Events Joined',
      value: insights.events_joined || 0,
      icon: '🎉',
      description: 'Events you\'ve participated in',
      color: 'purple'
    },
    {
      key: 'events_hosted',
      label: 'Events Hosted',
      value: insights.events_hosted || 0,
      icon: '🎪',
      description: 'Events you\'ve created',
      color: 'blue'
    },
    {
      key: 'groups_joined',
      label: 'Groups Joined',
      value: insights.groups_joined || 0,
      icon: '👥',
      description: 'Hobby groups you\'re part of',
      color: 'green'
    },
    {
      key: 'avg_compatibility_score',
      label: 'Avg Compatibility',
      value: insights.avg_compatibility_score ? (insights.avg_compatibility_score * 100).toFixed(1) + '%' : '0%',
      icon: '⭐',
      description: 'Your average compatibility score',
      color: 'yellow'
    }
  ];

  return (
    <div className="container insights-container">
      <div className="insights-header">
        <h1>Your Match Insights</h1>
        <p className="insights-subtitle">
          Track your activity and see how well you're connecting with others
        </p>
        {insights.updated_at && (
          <p className="insights-updated">
            Last updated: {new Date(insights.updated_at).toLocaleString()}
          </p>
        )}
      </div>

      <div className="insights-grid">
        {insightCards.map((card) => (
          <div key={card.key} className={`insight-card insight-card-${card.color}`}>
            <div className="insight-icon">{card.icon}</div>
            <div className="insight-content">
              <h3 className="insight-label">{card.label}</h3>
              <div className="insight-value">{card.value}</div>
              <p className="insight-description">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchInsightsPage;
