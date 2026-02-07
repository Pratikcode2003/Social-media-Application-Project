import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReelsAction } from "../../Redux/Reels/reels.action";
import { Box, Typography } from "@mui/material";
import ReelsFeed from "./ReelsFeed";
import { height } from "@mui/system";
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
const Reels = () => {
  const dispatch = useDispatch();
  const { reels, loading, error } = useSelector(store => store.reels);

  useEffect(() => {
    dispatch(getAllReelsAction());
  }, [dispatch]);

  return (

    <div>
      
      {loading && <Typography color="white">Loading reels...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && reels.length === 0 && (
        <Box sx={{ textAlign: "center", height:"90vh",width:"100%",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column" }}>
          <MovieCreationOutlinedIcon sx={{fontSize:"150px"}}/>
          <Typography color="White" variant="h5" sx={{ mb: 1 }}>
            No reels found
          </Typography>
          <Typography color="gray" variant="body2">
            Follow creators or upload your own reels to see them here.
          </Typography>
        </Box>
      )}

    {!loading && !error && reels.length > 0 && (
        <ReelsFeed reels={reels} />
      )}
    </div>
  );
};

export default Reels;
