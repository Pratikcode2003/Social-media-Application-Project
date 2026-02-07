import React, { useState } from "react";
import { Avatar, Card, CardHeader, IconButton, Box, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useDispatch, useSelector } from "react-redux";
import DeleteChatModal from "./DeleteChatModal";
import { deleteChat } from "../../Redux/Message/Message.action";

const UserChatCard = ({ chat, onChatDeleted }) => {
    const dispatch = useDispatch();
    const { auth } = useSelector((store) => store);
    const [openDelete, setOpenDelete] = useState(false);

    const otherUser = auth.user.id === chat.users[0].id ? chat.users[1] : chat.users[0];

    const getLastMessageText = () => {
        if (!chat.messages || chat.messages.length === 0) return "New message";

        const lastMessage = chat.messages[chat.messages.length - 1];
        const prefix = lastMessage.user?.id === auth.user.id ? "You: " : "";

        if (lastMessage.image) return `${prefix}📷 Image`;

        const content = lastMessage.content || "";
        // Show only first 10 letters
        const visible = content.length > 10 ? content.substring(0, 10) + "..." : content;
        return prefix + visible;
    };

    const handleDeleteChat = () => {
        dispatch(deleteChat(chat.id));
        setOpenDelete(false);
        onChatDeleted(chat.id);
    };

    return (
        <>
            <Card
                className="cursor-pointer"
                sx={{
                    transition: "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.04)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                        transform: "translateY(-1px)",
                    },
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            src={otherUser.profileImage}
                            sx={{ width: "3rem", height: "3rem" }}
                        />
                    }
                    action={
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDelete(true);
                            }}
                        >
                            <MoreHorizIcon />
                        </IconButton>
                    }
                    title={
                        <Box>
                            <Typography sx={{ fontWeight: 500 }}>
                                {otherUser.firstName + " " + otherUser.lastName}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.875rem",
                                    color: "rgba(255,255,255,0.65)",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {getLastMessageText()}
                            </Typography>
                        </Box>
                    }
                />
            </Card>


            <DeleteChatModal
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                onDelete={handleDeleteChat}
            />
        </>
    );
};

export default UserChatCard;
