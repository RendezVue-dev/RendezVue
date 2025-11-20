import React from 'react';

const MatchCard = ({ match }) => {
  return (
    <div className="match-card">
      {/* TODO: Display match info, hobbies, compatibility, etc. */}
      <h2>{match.username}</h2>
      {/* ... */}
    </div>
  );
};

export default MatchCard;
