import { Avatar, Button, Card, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ReelThumbnail from "../Reels/ReelThumbnail";
import Dialog from "@mui/material/Dialog";
import PostCard from "../Posts/PostCard";
import UserReelsCard from "../Reels/UserReelsCard";
import ProfileModal from "./ProfileModal";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import { getAllReelsAction } from "../../Redux/Reels/reels.action";
import {
  getUsersPostAction,
  getSavedPostsAction
} from "../../Redux/Post/post.action";
import {
  followUserAction,
  unfollowUserAction
} from "../../Redux/Auth/auth.action";

import { api } from "../../config/api";

const tabs = [
  { value: "post", name: "Posts" },
  { value: "reels", name: "Reels" },
  { value: "saved", name: "Saved" },
  // { value: "repost", name: "Reposts" }
];

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [openReel, setOpenReel] = useState(false);
  const [activeReel, setActiveReel] = useState(null);
  const [openProfileImage, setOpenProfileImage] = useState(false);


  const [value, setValue] = useState("post");
  const [open, setOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  const { auth } = useSelector(store => store);
  const { posts, savedPosts } = useSelector(store => store.post);
  const { reels, loading } = useSelector(store => store.reels);

  const isOwnProfile = auth?.user?.id === Number(id);

  /* ================= FETCH POSTS & REELS ================= */
  useEffect(() => {
    if (id) {
      dispatch(getUsersPostAction(id));
      dispatch(getAllReelsAction());
    }
  }, [dispatch, id]);

  /* ================= FETCH SAVED POSTS ================= */
  useEffect(() => {
    if (isOwnProfile) {
      dispatch(getSavedPostsAction());
    }
  }, [dispatch, isOwnProfile]);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const { data } = await api.get(`/api/users/${id}`);
        setProfileUser(data);
      } catch (error) {
        console.log("profile fetch error", error);
      }
    };

    if (isOwnProfile) {
      setProfileUser(auth.user);
    } else {
      fetchProfileUser();
    }
  }, [id, auth.user, isOwnProfile]);

  if (!auth?.user || !profileUser) return null;

  /* ================= FOLLOW LOGIC ================= */
  const isFollowing = auth.user.followings?.includes(profileUser.id);

  const handleFollow = () => {
    if (isFollowing) {
      dispatch(unfollowUserAction(profileUser.id));
    } else {
      dispatch(followUserAction(profileUser.id));
    }
  };

  /* ================= FILTER DATA ================= */
  const userPosts = Array.isArray(posts)
    ? posts.filter(post => post?.user?.id === Number(id))
    : [];

  const userReels = Array.isArray(reels)
    ? reels.filter(reel => reel?.user?.id === Number(id))
    : [];

  /* ================= UI HANDLERS ================= */
  const handleChange = (event, newValue) => setValue(newValue);
  const handleOpenProfileModal = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Card className="py-5 flex justify-center">
      <div className="w-full max-w-[800px]">

        {/* COVER IMAGE */}
        <div className="rounded-md overflow-hidden">
          <img
            className="h-[15rem] w-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfkkPnSBxXY29USeSbfStLFJL8CeY_COsYWA&s"
            alt="cover"
          />
        </div>

        {/* AVATAR + BUTTON */}
        <div className="px-5 flex justify-between items-start mt-5 h-[5rem]">
          <Avatar
            className="transform -translate-y-24 cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-600"
            src={profileUser.profileImage}
            sx={{
              height: "10rem",
              width: "10rem",
              border: "3px solid white",
            }}
            onClick={() => setOpenProfileImage(true)}
          />

          <Dialog
            open={openProfileImage}
            onClose={() => setOpenProfileImage(false)}
            fullScreen
            sx={{
              "& .MuiDialog-paper": {
                bgcolor: "rgba(0,0,0,0.9)", // Dark background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            }}
          >
            <IconButton
              onClick={() => setOpenProfileImage(false)}
              sx={{
                position: "absolute",
                top: 40,
                right: 16,
                zIndex: 10,
                color: "white",
                bgcolor: "rgba(0,0,0,0.4)",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.6)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            <img
              src={profileUser.profileImage}
              alt="Profile"
              style={{
                maxHeight: "90%",
                maxWidth: "90%",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Dialog>


          {isOwnProfile ? (
            <Button
              variant="outlined"
              sx={{ borderRadius: "20px" }}
              onClick={handleOpenProfileModal}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              sx={{ borderRadius: "20px" }}
              onClick={handleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        {/* USER INFO */}
        <div className="p-5">
          <h1 className="py-1 font-bold text-xl">
            {profileUser.firstName} {profileUser.lastName}
          </h1>

          <p>
            @{profileUser.firstName.toLowerCase()}_
            {profileUser.lastName.toLowerCase()}
          </p>

          <div className="flex gap-5 items-center py-3">
            <span>{userPosts.length} Posts</span>
            <span>{profileUser.followers?.length || 0} Followers</span>
            <span>{profileUser.followings?.length || 0} Following</span>
          </div>

          <p className="text-gray-300">
            {profileUser.bio || "No bio added yet"}
          </p>
        </div>

        {/* TABS */}
        <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            {tabs.map(tab => (
              <Tab key={tab.value} value={tab.value} label={tab.name} />
            ))}
          </Tabs>
        </Box>

        {/* TAB CONTENT */}
        <div className="flex justify-center">

          {/* POSTS */}
          {value === "post" && (
            <div className="space-y-5 w-[70%] my-10">
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <PostCard key={post.id} item={post} />
                ))
              ) : (
                <p className="text-center text-gray-400">No posts yet</p>
              )}
            </div>
          )}

          {/* REELS */}
          {value === "reels" && (
            <>
              <div className="grid grid-cols-3 gap-2 my-5">
                {userReels.length > 0 ? (
                  userReels.map(reel => (
                    <ReelThumbnail
                      key={reel.id}
                      reel={reel}
                      onClick={() => {
                        setActiveReel(reel);
                        setOpenReel(true);
                      }}
                    />
                  ))
                ) : (
                  <p className="col-span-3 text-center text-gray-400">
                    No reels yet
                  </p>
                )}
              </div>

              {/* FULLSCREEN REEL PLAYER */}
              <Dialog
                open={openReel}
                onClose={() => setOpenReel(false)}
                fullScreen
                sx={{
                  "& .MuiDialog-paper": {
                    bgcolor: "black",
                  },
                }}
              >
                {/* CLOSE BUTTON */}
                <IconButton
                  onClick={() => setOpenReel(false)}
                  sx={{
                    position: "absolute",
                    top: 75,
                    right: 16,
                    zIndex: 10,
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.4)",
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.6)",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>

                {activeReel && <UserReelsCard onClose={() => setOpenReel(false)} reel={activeReel} />}
              </Dialog>

            </>
          )}


          {/* SAVED POSTS ✅ */}
          {value === "saved" && (
            <div className="space-y-5 w-[70%] my-10">
              {savedPosts?.length > 0 ? (
                savedPosts.map(post => (
                  <PostCard key={post.id} item={post} />
                ))
              ) : (
                <p className="text-center text-gray-400">
                  No saved posts
                </p>
              )}
            </div>
          )}

          {/* REPOSTS
          {value === "repost" && (
            <div className="my-10">
              <p className="text-gray-400">Reposts coming soon</p>
            </div>
          )} */}
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <ProfileModal open={open} handleClose={handleClose} />
    </Card>
  );
};

export default Profile;
