import React, { useState, useEffect } from 'react';

const ExplorePage = () => {
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await fetch('/api/hobbies');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHobbies(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHobbies();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="container">
      <h1>Explore Hobbies</h1>
      <ul>
        {hobbies.map((hobby) => (
          <li key={hobby.id}>{hobby.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExplorePage;
