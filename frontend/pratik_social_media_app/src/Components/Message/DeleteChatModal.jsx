import { Modal, Box, Button, Typography } from "@mui/material";
import React from "react";
const DeleteChatModal = ({ open, onClose, onDelete }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "#191c29",
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography sx={{ mb: 2 }}>
          Delete this chat?
        </Typography>

        <Button
          fullWidth
          sx={{ color: "red", mb: 1 }}
          onClick={onDelete}
        >
          Delete
        </Button>

        <Button fullWidth onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteChatModal;
