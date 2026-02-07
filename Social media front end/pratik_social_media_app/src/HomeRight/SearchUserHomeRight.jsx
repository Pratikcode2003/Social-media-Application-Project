import { Avatar, Card, CardHeader, Button } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { followUserAction, searchUser, unfollowUserAction } from '../Redux/Auth/auth.action';

const SearchUserHomeRight = () => {
  const [username, setUsername] = useState("");
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchUser = (e) => {
    const value = e.target.value;
    setUsername(value);
    dispatch(searchUser(value));
  };

  const handleFollowToggle = (user) => {
    const isFollowing = auth.user?.followings?.includes(user.id);
    if (isFollowing) {
      dispatch(unfollowUserAction(user.id));
    } else {
      dispatch(followUserAction(user.id));
    }
  };

  return (
    <div>
      <div className='py-5 relative'>
        <input
          type="text"
          className='bg-transparent border border-[#3b4054] outline-none w-full px-5 py-3 rounded-full'
          placeholder='Search user...'
          onChange={handleSearchUser}
          value={username}
        />
      </div>

      {username && auth.searchUser.map((user, key) => (
        <Card key={key} className="mb-2 cursor-pointer"
          sx={{
            mb: 1,
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            },
          }} >
          <CardHeader
            onClick={() => navigate(`/profile/${user.id}`)}
            avatar={<Avatar src={user.profileImage} />}
            title={`${user.firstName} ${user.lastName}`}
            subheader={`@${user.firstName.toLowerCase()}_${user.lastName.toLowerCase()}`}
            action={
              auth.user.id !== user.id && (
                <Button
                  sx={{ paddingRight: 1 }}
                  size="small"
                  color='primary'
                  onClick={(e) => { e.stopPropagation(); handleFollowToggle(user); }}
                >
                  {auth.user.followings?.includes(user.id) ? "Unfollow" : "Follow"}
                </Button>
              )
            }
          />
        </Card>
      ))}
    </div>
  );
};

export default SearchUserHomeRight;
