import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createStoryAction } from '../../Redux/Story/story.action';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const CreateStoryModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [captions, setCaptions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select an image or video");
      return;
    }

    setLoading(true);
    try {
      const fileType = file.type.includes("video") ? "video" : "image";
      const uploadedUrl = await uploadToCloudinary(file, fileType);
      dispatch(createStoryAction({ image: uploadedUrl, captions }));
      handleClose();
    } catch (err) {
      console.error("Error uploading file", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Styled file input */}
        <label
          htmlFor="story-file-upload"
          style={{
            border: '2px dashed #3b4054',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            color: file ? '#000' : '#888',
            backgroundColor: '#f4f4f4',
          }}
        >
          {file ? `Selected: ${file.name}` : "Click or drag file here to upload"}
        </label>
        <input
          id="story-file-upload"
          type="file"
          accept="image/*,video/*"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <TextField
          label="Captions"
          value={captions}
          onChange={(e) => setCaptions(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Create Story"}
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateStoryModal;
