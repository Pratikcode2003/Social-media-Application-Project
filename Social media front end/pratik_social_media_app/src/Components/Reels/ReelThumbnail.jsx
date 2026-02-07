import React from "react";
import { Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const ReelThumbnail = ({ reel, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",   // ✅ square
        overflow: "hidden",
        cursor: "pointer",
        bgcolor: "black",
        borderRadius: 1,
      }}
    >
      <video
        src={reel.video}
        muted
        preload="metadata"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none", // ❌ no play
        }}
      />

      {/* Play icon overlay */}
      <PlayArrowIcon
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 40,
          color: "white",
          opacity: 0.85,
        }}
      />
    </Box>
  );
};

export default ReelThumbnail;
