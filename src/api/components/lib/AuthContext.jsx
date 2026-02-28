import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '../../base44Client';
import { appParams } from './app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }
  const [isPublicAccess, setIsPublicAccess] = useState(false); // Track if user has guest/public access

  useEffect(() => {
    checkAppState();
    // Check if there's a stored public access user on mount
    const storedPublicUser = localStorage.getItem('publicAccessUser');
    if (storedPublicUser && !appParams.token) {
      try {
        const publicUser = JSON.parse(storedPublicUser);
        setUser(publicUser);
        setIsPublicAccess(true);
      } catch (e) {
        console.error('Failed to restore public access user:', e);
        localStorage.removeItem('publicAccessUser');
      }
    }
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      // First, check app public settings (with token if available)
      // This will tell us if auth is required, user not registered, etc.
      const appClient = createAxiosClient({
        baseURL: `/api/apps/public`,
        headers: {
          'X-App-Id': appParams.appId
        },
        token: appParams.token, // Include token if available
        interceptResponses: true
      });

      try {
        const publicSettings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        setAppPublicSettings(publicSettings);

        // If we got the app public settings successfully, check if user is authenticated
        if (appParams.token) {
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        console.error('App state check failed:', appError);

        // Handle app-level errors
        if (appError.status === 403 && appError.data?.extra_data?.reason) {
          const reason = appError.data.extra_data.reason;
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({
              type: reason,
              message: appError.message
            });
          }
        } else {
          setAuthError({
            type: 'unknown',
            message: appError.message || 'Failed to load app'
          });
        }
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      // Now check if the user is authenticated
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);

      // If user auth fails, it might be an expired token
      if (error.status === 401 || error.status === 403) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Explicitly navigate to the home page to ensure the landing page is shown
    window.location.href = window.location.origin;
  };

  const navigateToLogin = () => {
    // Use the SDK's redirectToLogin method
    base44.auth.redirectToLogin(window.location.href);
  };

  const loginAsPublic = (publicUserData = {}) => {
    // Create a guest user object for public/guest access
    const guestUser = {
      id: 'public_user_' + Math.random().toString(36).substr(2, 9),
      name: publicUserData.name || 'Public User',
      email: publicUserData.email || null,
      isPublicUser: true,
      ...publicUserData
    };
    setUser(guestUser);
    setIsAuthenticated(false); // Not authenticated with auth system
    setIsPublicAccess(true); // But has public access
    setAuthError(null);
    localStorage.setItem('publicAccessUser', JSON.stringify(guestUser));
  };

  const logoutPublicAccess = () => {
    setUser(null);
    setIsPublicAccess(false);
    localStorage.removeItem('publicAccessUser');
    window.location.href = window.location.origin;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      isPublicAccess,
      logout,
      navigateToLogin,
      loginAsPublic,
      logoutPublicAccess,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
