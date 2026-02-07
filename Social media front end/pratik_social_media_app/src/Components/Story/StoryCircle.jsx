import { Avatar } from '@mui/material';
import React, { useState } from 'react';
import StoryViewerModal from './StoryViewerModal';

const StoryCircle = ({ userStories }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        {/* Gradient border wrapper */}
        <div
          style={{
            padding: '3px', // border thickness
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4)', // Instagram gradient
            display: 'inline-block',
          }}
        >
          <Avatar
            src={userStories.stories[0]?.image}
            sx={{
              width: '5rem',
              height: '5rem',
              border: '2px solid #090a0d', // optional inner border to separate from gradient
            }}
          />
        </div>
        <p className="text-sm mt-1">{userStories.user.firstName}</p>
      </div>

      <StoryViewerModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        userStories={userStories}
      />
    </>
  );
};

export default StoryCircle;
