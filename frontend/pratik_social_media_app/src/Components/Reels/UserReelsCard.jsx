import React, { useRef, useState, useEffect, memo } from "react";
import {
  Card,
  CardMedia,
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
  Menu,
  MenuItem,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

import { useDispatch, useSelector } from "react-redux";
import { likeReelAction, deleteReelAction } from "../../Redux/Reels/reels.action";
import { followUserAction, unfollowUserAction } from "../../Redux/Auth/auth.action";

const UserReelsCard = memo(({ reel,onClose }) => {
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [progress, setProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


  const isLiked = reel.liked?.some(u => u.id === auth.user?.id);
  const isOwner = reel.user?.id === auth.user?.id;
  const isFollowing = auth.user?.followings?.includes(reel.user?.id);

  /* AUTO PLAY / PAUSE */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current || videoError) return;
        if (entry.isIntersecting) {
          videoRef.current.play().catch(console.error);
        } else {
          videoRef.current.pause();
        }
        setIsPlaying(entry.isIntersecting && !videoError);
      },
      { threshold: 0.8 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [videoError]);

  /* VIDEO PROGRESS */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;
    const updateProgress = () => setProgress((video.currentTime / video.duration) * 100);
    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, [videoError]);

  /* PLAY/PAUSE */
  const handleTogglePlay = e => {
    e.stopPropagation();
    if (!videoRef.current || videoError) return;
    videoRef.current.paused
      ? videoRef.current.play().catch(console.error)
      : videoRef.current.pause();
    setIsPlaying(!videoRef.current.paused);
  };

  /* LIKE BUTTON */
  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(likeReelAction(reel.id));
  };


  /* DOUBLE CLICK LIKE */
  const handleDoubleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLiked) dispatch(likeReelAction(reel.id));
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 600);
  };

  /* FOLLOW / UNFOLLOW */
  const handleFollow = e => {
    e.preventDefault();
    e.stopPropagation();
    isFollowing
      ? dispatch(unfollowUserAction(reel.user.id))
      : dispatch(followUserAction(reel.user.id));
  };

  /* DELETE */
  const handleDelete = e => {
    e.preventDefault();
    e.stopPropagation();
    setMenuAnchor(null);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteReelAction(reel.id));
    setOpenDeleteDialog(false);
    if (onClose) onClose()
  };




  const handleVideoError = () => setVideoError(true);

  return (
    <Card sx={{ height: "100vh", bgcolor: "black", borderRadius: 0, position: "relative" }}>
      {/* VIDEO PROGRESS */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          bgcolor: "rgba(255,255,255,0.3)",
          "& .MuiLinearProgress-bar": { bgcolor: "white" },
          zIndex: 10,
        }}
      />

      {/* VIDEO */}
      <Box
        sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}
        onClick={handleTogglePlay}
        onDoubleClick={handleDoubleClick}
      >
        <CardMedia
          component="video"
          ref={videoRef}
          src={reel.video}
          muted
          loop
          playsInline
          controls={false}
          onError={handleVideoError}
          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
        />

        {videoError && (
          <Typography
            sx={{ position: "absolute", color: "white", bgcolor: "rgba(0,0,0,0.7)", px: 2, py: 1, borderRadius: 1 }}
          >
            Video unavailable
          </Typography>
        )}

        {/* BIG HEART */}
        {showHeart && <FavoriteIcon sx={{ position: "absolute", fontSize: 90, color: "white" }} />}
        {!isPlaying && !videoError && <PlayArrowIcon sx={{ position: "absolute", fontSize: 60, color: "white" }} />}

        {/* RIGHT SIDE ACTIONS */}
        <Box sx={{ position: "absolute", right: 16, bottom: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 ,justifyContent:"center"}}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" ,justifyContent:"center" }}>
            <IconButton type="button" onClick={handleLike}>
              {isLiked ? <FavoriteIcon sx={{ color: "red", fontSize: 52 }} /> : <FavoriteBorderIcon sx={{ color: "white", fontSize: 52 }} />}
            </IconButton>
            <Typography color="white" align="center" variant="caption">{reel.liked?.length || 0}</Typography>
          </Box>

          {/* <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <IconButton type="button">
              <CommentIcon sx={{ color: "white", fontSize: 32 }} />
            </IconButton>
            <Typography color="white" align="center" variant="caption">{reel.comments?.length || 0}</Typography>
          </Box> */}

          {/* <IconButton type="button"><ShareIcon sx={{ color: "white", fontSize: 32 }} /></IconButton>
          <IconButton type="button"><BookmarkBorderIcon sx={{ color: "white", fontSize: 32 }} /></IconButton> */}
        </Box>

        {/* BOTTOM USER INFO */}
        <Box sx={{ position: "absolute", bottom: 16, left: 16, right: 80, color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <Avatar src={reel.user?.profileImage || ""} />
            <Typography fontWeight={600}>{reel.user?.firstName + " " + reel.user?.lastName}</Typography>
            {!isOwner && (
              <Button size="small" onClick={handleFollow} sx={{ color: "white", textTransform: "none", border: "1px solid white", ml: 1 }}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Box>
          {reel.title && <Typography variant="body2" sx={{ mb: 1 }}>{reel.title}</Typography>}
          {reel.music && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MusicNoteIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">{reel.music}</Typography>
            </Box>
          )}
        </Box>

        {/* MENU */}
        {isOwner && (
          <>
            <IconButton
              onClick={e => setMenuAnchor(e.currentTarget)}
              sx={{ position: "absolute", top: 16, right: 16, color: "white" }}
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              disableScrollLock
            >
              <MenuItem onClick={handleDelete}>
                <DeleteIcon color="error" sx={{ mr: 1 }} /> Delete
              </MenuItem>
            </Menu>
          </>
        )}

      </Box>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "black", // Dark background to match reels theme
            color: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            minWidth: 300,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: "1.25rem",
            pb: 2,
          }}
        >
          Delete Reel
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            pb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.8)",
              mb:1
            }}
          >
            Are you sure you want to delete this reel? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            pb: 2,
          }}
        >
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              color: "white",
              border: "1px solid rgba(255,255,255,0.5)",
              textTransform: "none",
              px: 3,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{
              bgcolor: "#ff4444",
              color: "white",
              textTransform: "none",
              px: 3,
              "&:hover": {
                bgcolor: "#cc0000",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
});

export default UserReelsCard;
