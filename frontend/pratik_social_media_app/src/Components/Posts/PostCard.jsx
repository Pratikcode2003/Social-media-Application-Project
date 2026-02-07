import React, { useState } from "react";
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Divider,
    IconButton,
    Typography,
    Box,
    TextField,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SendIcon from "@mui/icons-material/Send";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";

import { useDispatch, useSelector } from "react-redux";
import {
    createCommentAction,
    deletePostAction,
    likePostAction,
    savePostAction
} from "../../Redux/Post/post.action";

const PostCard = ({ item: initialItem }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentInput, setCommentInput] = useState(""); // Add state for comment input
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const dispatch = useDispatch();

    // ✅ GET DATA FROM REDUX
    const { auth } = useSelector(store => store);
    const { posts, savedPosts } = useSelector(store => store.post);

    if (!initialItem || !initialItem.user) return null;

    // ✅ Always sync with latest Redux post
    const item = posts.find(p => p.id === initialItem.id) || initialItem;

    /* ================= ACTION HANDLERS ================= */

    const handleShowComment = () => {
        setShowComments(prev => !prev);
    };

    const handleCreateComment = () => {
        if (!commentInput.trim()) return;
        dispatch(createCommentAction({
            postId: item.id,
            data: { content: commentInput }
        }));
        setCommentInput(""); // Clear input after submitting
    };

    const handleLikePost = () => {
        dispatch(likePostAction(item.id));
    };

    const handleSavePost = () => {
        dispatch(savePostAction(item.id));
    };

    /* ================= CHECK STATES ================= */

    const isPostLiked = () => {
        if (!auth?.user || !item?.liked) return false;
        return item.liked.some(user => user.id === auth.user.id);
    };

    const isPostSaved = () => {
        if (!savedPosts || savedPosts.length === 0) return false;
        return savedPosts.some(post => post.id === item.id);
    };

    /* ================= UI ================= */

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const isOwner = auth?.user?.id === item.user.id;

    const handleMenuOpen = (e) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const handleDeletePost = () => {
        handleMenuClose();
        setOpenDeleteDialog(true);
    };


    const confirmDelete = () => {
        handleMenuClose();
        dispatch(deletePostAction(item.id));
        setOpenDeleteDialog(false);
    };


    return (
        <Card sx={{
            mb: 2,
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "transform",
            "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            },
        }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: "white", color: "black" }}>
                        {item.user.firstName?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                }
                action={
                    isOwner && (
                        <>
                            <IconButton onClick={handleMenuOpen}>
                                <MoreVertIcon />
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleMenuClose}
                                disableScrollLock
                                PaperProps={{
                                    sx: { borderRadius: 2, minWidth: 150 },
                                }}
                            >
                                <MenuItem
                                    onClick={handleDeletePost}
                                    sx={{ color: "error.main", gap: 1 }}
                                >
                                    <DeleteIcon fontSize="small" />
                                    Delete Post
                                </MenuItem>
                            </Menu>
                        </>
                    )
                }
                title={`${item.user.firstName} ${item.user.lastName}`}
                subheader={`@${item.user.firstName.toLowerCase()}_${item.user.lastName.toLowerCase()}`}
            />


            {item.image && (
                <CardMedia
                    component="img"
                    image={item.image}
                    alt="Post"
                    sx={{
                        width: "100%",       // fill card width
                        height: "auto",      // maintain aspect ratio
                        objectFit: "contain", // prevents cropping, keeps whole image visible
                        maxHeight: 615,       // optional: prevents extremely tall images
                        // borderRadius: 1,
                        backgroundColor: "#0b0b0b", // or theme background

                    }}
                />
            )}



            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {item.caption}
                </Typography>
            </CardContent>

            <CardActions disableSpacing className="flex justify-between">
                <div>
                    <IconButton onClick={handleLikePost} sx={{
                        transition: "transform 0.2s ease",
                        "&:hover": { transform: "scale(1.15)" },
                    }}>
                        {isPostLiked()
                            ? <FavoriteIcon color="error" />
                            : <FavoriteBorderIcon />
                        }
                    </IconButton>
                    <span className="text-sm mr-3">{item.liked?.length || 0}</span>



                    {/* <IconButton>
                        <ShareIcon />
                    </IconButton> */}

                    <IconButton onClick={handleShowComment} sx={{
                        transition: "transform 0.2s ease",
                        "&:hover": { transform: "scale(1.15)" },
                    }}>
                        <ChatBubbleIcon />
                    </IconButton>
                </div>

                <div>
                    <IconButton onClick={handleSavePost} sx={{
                        transition: "transform 0.2s ease",
                        "&:hover": { transform: "scale(1.15)" },
                    }}>
                        {isPostSaved()
                            ? <BookmarkIcon color="primary" />
                            : <BookmarkBorderIcon />
                        }
                    </IconButton>
                    <span className="text-sm">
                        {item.savedCount || 0}
                    </span>

                </div>
            </CardActions>
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
                    Delete Post
                </DialogTitle>
                <DialogContent
                    sx={{
                        textAlign: "center",
                        pb: 3,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "1rem",
                            color: "rgba(255,255,255,0.8)",
                        }}
                    >
                        Are you sure you want to delete this post? This action cannot be undone.
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
            {showComments && (
                <Box sx={{ px: 2, pb: 2 }}>
                    {/* Comment Input */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main'
                            }}
                        >
                            {auth?.user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                        </Avatar>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Write a comment..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCreateComment();
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 20,
                                    backgroundColor: 'action.hover',
                                }
                            }}
                        />
                        <IconButton
                            color="primary"
                            size="small"
                            sx={{ ml: 1 }}
                            onClick={handleCreateComment}
                            disabled={!commentInput.trim()}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* Comments List */}
                    <Box sx={{ mt: 2 }}>
                        {item.comments?.map((comment, index) => (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    backgroundColor: 'action.hover',
                                    borderRadius: 2,
                                    display: 'flex',
                                    gap: 1.5
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: 'secondary.main'
                                    }}
                                >
                                    {comment.user?.firstName?.charAt(0)?.toUpperCase() || "C"}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {comment.user?.firstName} {comment.user?.lastName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            @{comment.user?.firstName?.toLowerCase()}_{comment.user?.lastName?.toLowerCase()}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2">
                                        {comment.content}
                                    </Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            )}
        </Card>
    );
};

export default PostCard;