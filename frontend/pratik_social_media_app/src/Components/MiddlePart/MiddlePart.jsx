import { Avatar, Card, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import ArticleIcon from '@mui/icons-material/Article';
import PostCard from '../Posts/PostCard';
import CreatePostModal from '../CreatePost/CreatePostModal';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPostAction } from '../../Redux/Post/post.action';
import { getFollowingStoriesAction } from '../../Redux/Story/story.action'; // Changed import
import CreateStoryModal from '../Story/CreateStoryModal';
import StoryList from '../Story/StoryList';

const MiddlePart = () => {
  const dispatch = useDispatch();
  const { auth, story } = useSelector(store => store);
  const { post } = useSelector(store => store);

  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
  const [openCreateStoryModal, setOpenCreateStoryModal] = useState(false);

  const handleOpenCreatePostModel = () => setOpenCreatePostModal(true);
  const handleClose = () => setOpenCreatePostModal(false);

  // Fetch posts and stories
  useEffect(() => {
    dispatch(getAllPostAction());
    if (auth.user?.id) {
      // Changed from getStoryByUserAction to getFollowingStoriesAction
      dispatch(getFollowingStoriesAction());
    }
  }, [auth.user, post.newComment, dispatch]);

  return (
    <div>
      {/* Story Section */}
      <section className="relative flex items-center gap-4 p-4 bg-[#2C303E] rounded-md overflow-hidden">
        {/* Sticky New Story */}
        <div className="flex flex-col items-center justify-center cursor-pointer sticky z-10 pr-3 hover:scale-110 transition">
          <Avatar className="  " sx={{ width: "5rem", height: "5rem", }} onClick={() => setOpenCreateStoryModal(true)} >
            <AddIcon sx={{ fontSize: "2rem" }} />
          </Avatar>
          <p className="text-sm">New</p>
        </div>

        {/* Story List */}
        <StoryList />
      </section>

      <CreateStoryModal
        open={openCreateStoryModal}
        handleClose={() => setOpenCreateStoryModal(false)}
      />

      {/* Create Post Section */}
      <Card className='p-5 mt-5'
        sx={{
          mb: 2,
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          },
        }}>
        <div className='flex justify-between'>
          <Avatar sx={{height:60,width:60}} src={auth.user?.profileImage} />
          <input
            onClick={handleOpenCreatePostModel}
            className='outline-none w-[90%] rounded-full px-5 border-[#3b4054] border'
            type="text"
            placeholder='Create Post . . .'
          />
        </div>

        <div className='flex justify-center space-x-9 mt-5 cursor-pointer'>
          <div className='flex items-center' onClick={handleOpenCreatePostModel}>
            <IconButton color='primary'><ImageIcon /></IconButton>
            <span>Media</span>
          </div>
          <div className='flex items-center' onClick={handleOpenCreatePostModel}>
            <IconButton color='primary'><VideocamIcon /></IconButton>
            <span>Video</span>
          </div>
          <div className='flex items-center' onClick={handleOpenCreatePostModel}>
            <IconButton color='primary'><ArticleIcon /></IconButton>
            <span>Write Article</span>
          </div>
        </div>
      </Card>

      {/* Posts */}
      <div className='mt-5 space-y-5'>
        {post.posts.map((item, key) => <PostCard key={key} item={item} />)}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal handleClose={handleClose} open={openCreatePostModal} />
    </div>
  );
};

export default MiddlePart;