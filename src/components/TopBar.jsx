import React from "react";
import { useAuth } from "../hooks/useAuth";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle, Logout } from "@mui/icons-material";

const TopBar = ({ onMenuClick, title, sidebarOpen = false }) => {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleMenuClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Derive Discord display name and avatar from Supabase user
  const discordIdentity = user?.identities?.find?.(
    (i) => i.provider === "discord"
  );
  const idData = discordIdentity?.identity_data || {};
  const discordId = idData.id || user?.user_metadata?.discord_id;
  const discordAvatar = idData.avatar || user?.user_metadata?.discord_avatar;
  const discordUsername =
    idData.global_name ||
    idData.username ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.discord_username;
  const discriminator = idData.discriminator;
  const constructedAvatar =
    discordId && discordAvatar
      ? `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.png`
      : undefined;
  const defaultAvatar =
    typeof discriminator !== "undefined"
      ? `https://cdn.discordapp.com/embed/avatars/${
          Number(discriminator) % 5
        }.png`
      : undefined;
  const avatarUrl =
    idData.avatar_url ||
    user?.user_metadata?.avatar_url ||
    constructedAvatar ||
    defaultAvatar;
  const displayName = discordUsername || user?.email || "User";

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "none",
        marginLeft: {
          xs: 0,
          lg: sidebarOpen ? "256px" : "64px", // 256px = w-64, 64px = w-16
        },
        width: {
          xs: "100%",
          lg: sidebarOpen ? "calc(100% - 256px)" : "calc(100% - 64px)",
        },
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{
            marginRight: 2,
            display: { lg: "none" },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "block" },
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            {displayName}
          </Typography>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar
              src={avatarUrl}
              alt={displayName}
              sx={{ width: 32, height: 32 }}
            >
              {!avatarUrl && <AccountCircle />}
            </Avatar>
          </IconButton>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircle sx={{ marginRight: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <Logout sx={{ marginRight: 1 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
