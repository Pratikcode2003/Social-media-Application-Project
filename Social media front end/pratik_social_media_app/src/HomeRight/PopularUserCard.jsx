import { Avatar, Button, Card, CardHeader } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUserAction, unfollowUserAction } from '../Redux/Auth/auth.action';
import { useNavigate } from 'react-router-dom';

const PopularUserCard = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector(store => store);

  if (!user) return null;

  const isFollowing = auth.user?.followings?.includes(user.id);

  const handleFollowToggle = () => {
    if (isFollowing) {
      dispatch(unfollowUserAction(user.id));
    } else {
      dispatch(followUserAction(user.id));
    }
  };

  return (
    <Card
      sx={{
        background: "#333c4a",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": { background: "#3b4556" }
      }}
      onClick={() => navigate(`/profile/${user.id}`)}
    >
      <CardHeader
        sx={{
          pr: 3,
          alignItems: "center",
          "& .MuiCardHeader-action": {
            alignSelf: "center",
            marginTop: 0
          }
        }}
        avatar={<Avatar src={user.profileImage || ""} />}
        title={`${user.firstName} ${user.lastName}`}
        subheader={`@${user.firstName.toLowerCase()}_${user.lastName.toLowerCase()}`}
        action={
          auth.user.id !== user.id && (
            <Button
              size="small"
              variant={isFollowing ? "outlined" : "contained"}
              onClick={(e) => {
                e.stopPropagation(); // ✅ prevent card navigation
                handleFollowToggle();
              }}
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                minWidth: "90px"
              }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )
        }
      />
    </Card>
  );
};

export default PopularUserCard;

