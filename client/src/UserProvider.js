import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const login = (userId) => {
    setUserId(userId);
    localStorage.setItem('rsvpuserId', userId);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('rsvpuserId');
  };

  useEffect(() => {
    // Check if user ID exists in localStorage on component mount
    const storedUserId = localStorage.getItem('rsvpuserId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;