// SidebarNavigation.js
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';

export const navigationMenu = [
  { title: "Home", icon: <HomeIcon/>, path: "/" },
  { title: "Reels", icon: <ExploreIcon/>, path: "/reels" },
  { title: "Create Reels", icon: <ControlPointIcon/>, path: "/create-reels" },
  // { title: "Notification", icon: <NotificationsIcon />, path: "/notifications" },
  { title: "Messages", icon: <MessageIcon />, path: "/message" },
  // { title: "Lists", icon: <ListAltIcon />, path: "/lists" },
  // { title: "Community", icon: <GroupIcon />, path: "/community" },
  { title: "Profile", icon: <AccountCircleIcon />, path: "/profile/:id" },
];
