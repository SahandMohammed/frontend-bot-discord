import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    // Check for Discord OAuth callback
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const discordAuth = urlParams.get("discord_auth");
      const error = urlParams.get("error");
      const accessToken = urlParams.get("access_token");
      const refreshToken = urlParams.get("refresh_token");

      if (error) {
        console.error("Discord OAuth error:", error);
        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        return;
      }

      if (discordAuth === "success" && accessToken) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });

          if (error) {
            console.error("Error setting session:", error);
          } else {
            setUser(data.user);
          }
        } catch (error) {
          console.error("Error processing Discord OAuth callback:", error);
        }

        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    };

    getSession();
    handleOAuthCallback();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithDiscord = async () => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
      console.log(
        "Redirecting to Discord OAuth:",
        `${backendUrl}/api/auth/discord`
      );
      window.location.href = `${backendUrl}/api/auth/discord`;
    } catch (error) {
      console.error("Error in signInWithDiscord:", error);
    }
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithDiscord,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
