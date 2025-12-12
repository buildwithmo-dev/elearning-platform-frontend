import React, { useState, createContext, useContext, useEffect } from 'react';
import { supabase } from './supabaseClient'; // adjust path

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Fetch profile from Supabase
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

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(() => {
    // Try to load cached profile first
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(!userProfile); // only loading if no cached profile

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const freshProfile = await getProfile(session.user.id);
        setUserProfile(freshProfile);
        localStorage.setItem('userProfile', JSON.stringify(freshProfile));
      } else {
        setUserProfile(null);
        localStorage.removeItem('userProfile');
      }
      setLoading(false);
    };

    checkSession();

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const freshProfile = await getProfile(session.user.id);
        setUserProfile(freshProfile);
        localStorage.setItem('userProfile', JSON.stringify(freshProfile));
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        localStorage.removeItem('userProfile');
      }
    });

    return () => {
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userProfile, loading, setUserProfile, getProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
