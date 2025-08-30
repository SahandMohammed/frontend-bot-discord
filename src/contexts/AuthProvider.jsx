import React, { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { AuthContext } from "./authContext";

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

    // Handle Discord OAuth callback tokens from URL
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(
        window.location.hash.replace(/^#/, "")
      );
      const discordAuth = params.get("discord_auth");
      const error = params.get("error");
      // Supabase typically returns tokens in the hash fragment
      let accessToken =
        params.get("access_token") || hashParams.get("access_token");
      let refreshToken =
        params.get("refresh_token") || hashParams.get("refresh_token");

      if (error) {
        console.error("Discord OAuth error:", error);
        // Clean URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        return;
      }

      // If using Supabase-managed OAuth, discordAuth param may not exist; trust tokens presence
      if ((discordAuth === "success" || accessToken) && accessToken) {
        try {
          const { data, error: setErr } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });
          if (setErr) {
            console.error("Error setting Supabase session:", setErr);
          } else if (data?.user) {
            setUser(data.user);
          }
        } catch (e) {
          console.error("Failed processing OAuth callback:", e);
        } finally {
          // Clean URL (remove both search and hash)
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
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

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Start Supabase-managed Discord OAuth flow
  const signInWithDiscord = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: window.location.origin,
        scopes: "identify email",
        // Get the URL first so we can handle errors gracefully
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      return { error };
    }
    if (data?.url) {
      window.location.assign(data.url);
    }
    return { error: null };
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signInWithDiscord,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
