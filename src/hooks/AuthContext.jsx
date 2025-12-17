import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase/supabaseClient";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper inside the provider
  const fetchAndSetProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, is_instructor")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      setUserProfile(null);
    }
  };

  // The Logout Function (Now correctly scoped)
  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      // State is cleared automatically by onAuthStateChange, 
      // but we force it here for immediate UI feedback
      setUserProfile(null);
      setSession(null);
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchAndSetProfile(session.user.id);
      setLoading(false);
    });

    // 2. Listen for Auth Changes (Sign In, Sign Out, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (event === 'SIGNED_IN' && session) {
        await fetchAndSetProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        setSession(null);
        // Clear any local cache if you use it
        localStorage.removeItem("supabase.auth.token"); 
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = { 
    userProfile, 
    session, 
    loading, 
    logout, // Shared via context
    setUserProfile 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};