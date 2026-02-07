import React, { useRef } from "react";
import { Box } from "@mui/material";
import UserReelsCard from "./UserReelsCard";

const ReelsFeed = ({ reels }) => {
  const scrollRef = useRef(null);

  return (
    <Box
      ref={scrollRef}
      sx={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {reels.map((reel) => (
        <Box
          key={reel.id} // key ensures only the updated reel re-renders
          sx={{ height: "100vh", scrollSnapAlign: "start" }}
        >
          <UserReelsCard reel={reel} />
        </Box>
      ))}
    </Box>
  );
};

export default ReelsFeed;
