import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReelAction } from '../../Redux/Reels/reels.action';

import { useNavigate } from 'react-router-dom';
import { Card, TextField, Button, IconButton, Typography, Box, CircularProgress } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

const CreateReelsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const url = await uploadToCloudinary(file, 'video');
    setVideoUrl(url);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !videoUrl) return alert("Title and video are required!");

    dispatch(createReelAction({ title, video: videoUrl }));
    setTitle('');
    setVideoUrl('');
    navigate('/reels');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 6,
        px: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          p: 4,
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: 6,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
          Create a Reel
        </Typography>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <input
              type="file"
              accept="video/*"
              id="video-upload"
              style={{ display: 'none' }}
              onChange={handleVideoUpload}
            />
            <label htmlFor="video-upload">
              <Button
                variant="contained"
                startIcon={<VideoCallIcon />}
                component="span"
                sx={{ textTransform: 'none' }}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Video'}
              </Button>
            </label>
            {loading && <CircularProgress size={24} />}
          </Box>

          {videoUrl && (
            <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
              <video
                src={videoUrl}
                controls
                style={{
                  width: '100%',
                  height: '250px',
                  borderRadius: 8,
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ py: 1.5, fontWeight: 600 }}
            disabled={loading}
          >
            Post Reel
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default CreateReelsForm;
