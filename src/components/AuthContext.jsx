import React, { useState, createContext, useContext, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Adjust this path as necessary for the new file location

// 1. Create the Context
const AuthContext = createContext();

// Hook to easily consume the context
export const useAuth = () => useContext(AuthContext); // <-- EXPORTED

// Function to get the user's profile data
const getProfile = async (userId) => {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, is_instructor') 
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => { // <-- EXPORTED
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const profile = await getProfile(session.user.id);
        setUserProfile(profile);
      }
      setLoading(false);
    };
    checkSession();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const profile = await getProfile(session.user.id);
        setUserProfile(profile);
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    });

    return () => {
      if (listener?.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, []);

  const value = {
    userProfile,
    loading,
    setUserProfile,
    getProfile, // <-- Also export this if handleLogin needs it
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export getProfile separately if other components need it, 
// but here we include it in the context value for the Auth component.