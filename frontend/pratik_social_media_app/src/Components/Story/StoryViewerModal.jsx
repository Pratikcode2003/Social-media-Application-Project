import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { color } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { deleteStoryAction } from '../../Redux/Story/story.action';


const StoryViewerModal = ({ open, handleClose, userStories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!userStories) return null;

  const currentStory = userStories.stories[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % userStories.stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + userStories.stories.length) % userStories.stories.length);
  };

  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);

  const handleDelete = () => {
    dispatch(deleteStoryAction(currentStory.id));
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} sx={{ outline: 'none' }}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,        // fixed width
          height: 600,       // fixed height
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: 'black', zIndex: 10 }}
        >
          <CloseIcon sx={{ color: 'white' }} />
        </IconButton>

        {/* Username */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>
          {userStories.user.firstName + " " + userStories.user.lastName}
        </Typography>

        {currentStory.user.id === auth.user.id && (
          <IconButton
            onClick={handleDelete}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              color: 'white',
              zIndex: 10,
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}

        {/* Navigation Arrows */}
        {userStories.stories.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',

                zIndex: 10,

              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',

                zIndex: 10,

              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}

        {/* Story Image */}
        {currentStory.image && (
          <Box
            sx={{
              width: '100%',
              height: '100%',     // fill modal space
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={currentStory.image}
              onClick={handleNext}
              alt="story"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain', // scales image smoothly
                borderRadius: 8,
              }}
            />
          </Box>
        )}

        {/* Caption */}
        {currentStory.captions && (
          <Typography
            sx={{
              mt: 1,
              textAlign: 'center',
              wordBreak: 'break-word',
              px: 1,
            }}
          >
            {currentStory.captions}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default StoryViewerModal;
