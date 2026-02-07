import React from 'react';
import { navigationMenu } from './SidebarNavigation';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { Button, Card, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutAction } from '../../Redux/Auth/auth.action';
import Groups3Icon from '@mui/icons-material/Groups3';

const Sidebar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation(); // Get current path
  const { auth } = useSelector((store) => store);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNavigate = (item) => {
    if (item.title === 'Profile') {
      navigate(`/profile/${auth.user?.id}`);
    } else {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logoutAction());
    navigate('/login');
  };

  return (
    <Card className="card h-screen flex flex-col justify-between py-10 bg-gray-900 text-white">
      <div className="space-y-7 pl-6">
        {/* Top Icon and Text */}
        <div
          className="flex flex-col items-center justify-center pr-4 relative"
          style={{ top: '-10px' }}
        >
          {/* Icon with modern hover */}
          <div
            className="transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-xl cursor-pointer"
            style={{
              backgroundColor: '#4F46E5',
              borderRadius: '50%',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '6px',
            }}
            onClick={() => navigate('/')}
          >
            <Groups3Icon style={{ width: '28px', height: '28px', color: 'white' }} />
          </div>
          <h1
            className="logo text-center font-bold text-xl cursor-pointer transition-colors duration-300 hover:text-indigo-400"
            onClick={() => navigate('/')}
          >
            TOGETHERLY
          </h1>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-4">
          {navigationMenu.map((item, key) => {
            // Determine if this tab is active
            const isActive =
              location.pathname === item.path ||
              (item.title === 'Profile' && location.pathname.startsWith('/profile'));

            return (
              <div
                key={key}
                onClick={() => handleNavigate(item)}
                className="cursor-pointer flex items-center py-2 rounded-lg transition-all duration-300 transform group"
                style={{ backgroundColor: 'transparent' }}
              >
                {/* Icon wrapper */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-300
                  ${isActive ? 'bg-indigo-500 scale-110' : 'group-hover:bg-indigo-500 group-hover:scale-110'}
                `}
                >
                  {item.icon}
                </div>

                {/* Text */}
                <p
                  className={`ml-3 text-xl font-medium transition-all duration-300
                  ${isActive ? 'text-indigo-500 scale-105' : 'group-hover:text-white group-hover:scale-105'}
                `}
                >
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div>
        <Divider />
        <div className="flex items-center justify-between pt-5 pl-6 pr-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar
              src={auth.user?.profileImage}
              onClick={() => navigate(`/profile/${auth.user?.id}`)}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.5)',
                },
              }}
            />
            <div className="flex flex-col overflow-hidden min-w-0">
              <p
                className="font-bold text-sm truncate cursor-pointer transition-colors duration-300 hover:text-indigo-400"
                onClick={() => navigate(`/profile/${auth.user?.id}`)}
              >
                {auth.user?.firstName + ' ' + auth.user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">
                @{auth.user?.firstName.toLowerCase()}_{auth.user?.lastName.toLowerCase()}
              </p>
            </div>
          </div>

          <div>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{
                minWidth: 'auto',
                padding: 0,
                color: 'gray',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#4F46E5',
                  backgroundColor: 'rgba(79, 70, 229, 0.15)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <MoreVertIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              disableScrollLock
              PaperProps={{ sx: { mt: 1 } }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Sidebar;
