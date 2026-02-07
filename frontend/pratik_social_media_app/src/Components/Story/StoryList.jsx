import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowingStoriesAction } from '../../Redux/Story/story.action';
import StoryCircle from './StoryCircle';

const StoryList = () => {
  const dispatch = useDispatch();
  const { stories } = useSelector(store => store.story);

  useEffect(() => {
    // Fetch stories from users you follow
    dispatch(getFollowingStoriesAction());
  }, [dispatch]);

  // Group stories by user
  const groupedStories = Object.values(
    stories.reduce((acc, story) => {
      const userId = story.user.id;
      if (!acc[userId]) {
        acc[userId] = { user: story.user, stories: [] };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {})
  );

  return (
    <div className="flex gap-4 overflow-x-auto hideScrollbar">
      {groupedStories.map(userStories => (
        <StoryCircle key={userStories.user.id} userStories={userStories} />
      ))}
    </div>
  );
};

export default StoryList;