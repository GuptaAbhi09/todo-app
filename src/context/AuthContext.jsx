import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Check current user on load
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setIsGuest(false);
      }
      setLoading(false);
    };
    getUser();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) setIsGuest(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Auth functions
  const signup = (email, password) =>
    supabase.auth.signUp({ email, password });

  const login = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    setUser(null);
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        isGuest,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
