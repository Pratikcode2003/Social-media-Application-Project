package com.social.service;

import java.util.List;

import com.social.exception.UserException;
import com.social.model.Story;
import com.social.model.User;

public interface StoryService {
	public Story createStory(Story story, User user);
	
	public List<Story> findStoryByUserId(int userId) throws UserException;
	
	
	public void deleteStory(int storyId, int userId) throws UserException;
	
	// Add this method to StoryService interface
	List<Story> findStoriesByFollowingUsers(User user) throws UserException;
}
