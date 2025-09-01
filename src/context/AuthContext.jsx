import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseconfig';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [customUser, setCustomUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCustomAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setCustomUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };

    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (!firebaseUser) {
        checkCustomAuth(); 
      }
      setLoading(false);
    });

    checkCustomAuth();

    return unsubscribe;
  }, []);

  const customLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setCustomUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCustomUser(null);
    
    if (currentUser) {
      auth.signOut();
    }
  };

  const getActiveUser = () => {
    if (customUser) {
      return {
        ...customUser,
        isCustomAuth: true
      };
    }
    
    if (currentUser) {
      return {
        username: currentUser.displayName || currentUser.email,
        email: currentUser.email,
        role: 'user', 
        isCustomAuth: false
      };
    }
    
    return null;
  };

  const activeUser = getActiveUser();
  const isAuthenticated = !!(currentUser || customUser);

  const value = {
    currentUser, 
    customUser, 
    user: activeUser, 
    isAuthenticated,
    loading,
    customLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};