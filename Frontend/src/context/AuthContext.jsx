import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);

  const verifyTin = () => {
    setIsVerified(true);
  };

  return (
    <AuthContext.Provider value={{ isVerified, verifyTin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);