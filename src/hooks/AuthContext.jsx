// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase/supabaseClient"; // Adjust path if needed

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Helper to fetch profile from Supabase
const getProfile = async (userId) => {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, is_instructor")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

 const logout = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
  };

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : null;
  });
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("session");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(!userProfile);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      // Get current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        localStorage.setItem("session", JSON.stringify(session));
        const profile = await getProfile(session.user.id);
        setUserProfile(profile);
        localStorage.setItem("userProfile", JSON.stringify(profile));
      } else {
        setUserProfile(null);
        localStorage.removeItem("userProfile");
        localStorage.removeItem("session");
      }

      setLoading(false);
    };

    initAuth();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        localStorage.setItem("session", JSON.stringify(session));
        const profile = await getProfile(session.user.id);
        setUserProfile(profile);
        localStorage.setItem("userProfile", JSON.stringify(profile));
      } else {
        setUserProfile(null);
        setSession(null);
        localStorage.removeItem("userProfile");
        localStorage.removeItem("session");
      }
    });

    return () => {
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  const value = { userProfile, session, loading, setUserProfile, getProfile,logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
