import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Fade,
  Slide,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack,
} from "@mui/icons-material";
import MainLogo from "../assets/Main logo.png";

const AuthForm = () => {
  const [mode, setMode] = useState("signin"); // 'signin' or 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { signIn, resetPassword, signInWithDiscord } = useAuth();

  useEffect(() => {
    setMounted(true);
    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
  }, []);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError("");
    setMessage("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await resetPassword(email);
        setMessage("Password reset email sent. Please check your inbox.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const FloatingElement = ({ children, delay = 0 }) => (
    <div
      className="absolute animate-pulse"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: "3s",
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <FloatingElement delay={0}>
          <div className="w-72 h-72 bg-purple-500/10 rounded-full blur-3xl absolute top-10 left-10" />
        </FloatingElement>
        <FloatingElement delay={1}>
          <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl absolute bottom-10 right-10" />
        </FloatingElement>
        <FloatingElement delay={2}>
          <div className="w-64 h-64 bg-pink-500/10 rounded-full blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </FloatingElement>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Fade in={mounted} timeout={800}>
          <div className="w-full max-w-md">
            {/* Main Card */}
            <div className="relative">
              {/* Glassmorphism Background */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl" />

              <div className="relative p-8 md:p-10">
                {/* Header */}
                <Slide direction="down" in={mounted} timeout={600}>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 shadow-lg border border-white/20">
                      <img
                        src={MainLogo}
                        alt="Kurd Champions Gaming Community"
                        className="w-16 h-16 object-contain rounded-2xl"
                      />
                    </div>
                    <Typography
                      variant="h4"
                      className="font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                    >
                      {mode === "signin" ? "Welcome Back" : "Reset Password"}
                    </Typography>
                    <Typography variant="body1" className="text-gray-300">
                      {mode === "signin"
                        ? "Admin Portal - Kurd Champions Gaming Community"
                        : "Enter your email to receive a password reset link"}
                    </Typography>
                  </div>
                </Slide>

                {/* Alert Messages */}
                {error && (
                  <Fade in timeout={300}>
                    <Alert
                      severity="error"
                      className="mb-6 bg-red-500/10 border border-red-500/20 text-red-200"
                      sx={{
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        color: "#fecaca",
                        "& .MuiAlert-icon": { color: "#f87171" },
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                {message && (
                  <Fade in timeout={300}>
                    <Alert
                      severity="success"
                      className="mb-6"
                      sx={{
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                        color: "#bbf7d0",
                        "& .MuiAlert-icon": { color: "#4ade80" },
                      }}
                    >
                      {message}
                    </Alert>
                  </Fade>
                )}

                {/* Form */}
                <Slide direction="up" in={mounted} timeout={800}>
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Back Button for Reset Mode */}
                    {mode === "reset" && (
                      <Button
                        startIcon={<ArrowBack />}
                        onClick={() => handleModeChange("signin")}
                        className="text-gray-300 hover:text-white mb-4"
                        sx={{
                          color: "#d1d5db",
                          "&:hover": { color: "#ffffff" },
                        }}
                      >
                        Back to Sign In
                      </Button>
                    )}

                    {/* Email Field */}
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(10px)",
                          borderRadius: "12px",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(147, 51, 234, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#8b5cf6",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#d1d5db",
                          "&.Mui-focused": {
                            color: "#8b5cf6",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#ffffff",
                        },
                      }}
                    />

                    {/* Spacer */}
                    <div className="h-2" />

                    {/* Password Field */}
                    {mode === "signin" && (
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock className="text-gray-400" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                className="text-gray-400 hover:text-white"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(10px)",
                            borderRadius: "12px",
                            "& fieldset": {
                              borderColor: "rgba(255, 255, 255, 0.2)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(147, 51, 234, 0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#8b5cf6",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#d1d5db",
                            "&.Mui-focused": {
                              color: "#8b5cf6",
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#ffffff",
                          },
                        }}
                      />
                    )}

                    {/* Spacer */}
                    <div className="h-2" />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      className="relative h-14 rounded-xl overflow-hidden"
                      sx={{
                        background:
                          "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                        borderRadius: "12px",
                        height: "56px",
                        fontSize: "16px",
                        fontWeight: "600",
                        textTransform: "none",
                        boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                          boxShadow: "0 12px 40px rgba(139, 92, 246, 0.4)",
                          transform: "translateY(-2px)",
                        },
                        "&:disabled": {
                          background: "rgba(255, 255, 255, 0.1)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : mode === "signin" ? (
                        "Sign In"
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>

                    {/* Divider */}
                    {mode === "signin" && (
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-transparent text-gray-400">
                            or continue with
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Discord Login Button */}
                    {mode === "signin" && (
                      <Button
                        fullWidth
                        variant="outlined"
                        type="button"
                        onClick={async () => {
                          console.log("Discord button clicked");
                          const res = await signInWithDiscord?.();
                          if (res?.error) {
                            console.error("Discord OAuth error:", res.error);
                            setError(
                              res.error.message?.includes(
                                "provider is not enabled"
                              )
                                ? "Discord login is not enabled in Supabase. Enable the Discord provider in your Supabase Dashboard."
                                : res.error.message ||
                                    "Failed to start Discord login."
                            );
                          }
                        }}
                        disabled={loading}
                        className="relative h-14 rounded-xl overflow-hidden"
                        sx={{
                          position: "relative",
                          borderColor: "#5865F2",
                          color: "#5865F2",
                          backgroundColor: "rgba(88, 101, 242, 0.1)",
                          borderRadius: "12px",
                          height: "56px",
                          fontSize: "16px",
                          fontWeight: "600",
                          textTransform: "none",
                          boxShadow: "0 0 0px rgba(88, 101, 242, 0.0)",
                          animation: "discordGlow 2.4s ease-in-out infinite",
                          "&:hover": {
                            borderColor: "#4752C4",
                            backgroundColor: "rgba(88, 101, 242, 0.2)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 0 26px rgba(88, 101, 242, 0.55)",
                            animation: "discordGlow 1.6s ease-in-out infinite",
                          },
                          "&:disabled": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            color: "rgba(255, 255, 255, 0.3)",
                          },
                          transition: "all 0.3s ease",
                          "@keyframes discordGlow": {
                            "0%": {
                              boxShadow:
                                "0 0 0px rgba(88, 101, 242, 0.15), 0 0 0px rgba(236, 72, 153, 0.0)",
                            },
                            "50%": {
                              boxShadow:
                                "0 0 14px rgba(88, 101, 242, 0.45), 0 0 8px rgba(236, 72, 153, 0.15)",
                            },
                            "100%": {
                              boxShadow:
                                "0 0 0px rgba(88, 101, 242, 0.15), 0 0 0px rgba(236, 72, 153, 0.0)",
                            },
                          },
                        }}
                        startIcon={
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                          </svg>
                        }
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Continue with Discord"
                        )}
                      </Button>
                    )}

                    {/* Footer Links */}
                    {mode === "signin" && (
                      <div className="text-center pt-4">
                        <Button
                          onClick={() => handleModeChange("reset")}
                          className="text-gray-300 hover:text-purple-400"
                          sx={{
                            color: "#d1d5db",
                            textTransform: "none",
                            "&:hover": { color: "#a855f7" },
                          }}
                        >
                          Forgot your password?
                        </Button>
                      </div>
                    )}
                  </Box>
                </Slide>
              </div>
            </div>

            {/* Bottom Brand */}
            <Fade in={mounted} timeout={1200}>
              <div className="text-center mt-8">
                <Typography variant="body2" className="text-gray-400">
                  Kurd Champions Gaming Community © {new Date().getFullYear()}
                </Typography>
              </div>
            </Fade>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default AuthForm;
