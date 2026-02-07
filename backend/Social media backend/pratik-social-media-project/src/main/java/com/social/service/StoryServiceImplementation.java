package com.social.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.social.exception.UserException;
import com.social.model.Story;
import com.social.model.User;
import com.social.repository.StoryRepository;

@Service
public class StoryServiceImplementation implements StoryService{
	
	@Autowired
	StoryRepository storyRepository;
	
	@Autowired
	UserService userService;

	@Override
	public Story createStory(Story story, User user) {
		Story createdStory=new Story();
		createdStory.setCaptions(story.getCaptions());
		createdStory.setImage(story.getImage());
		createdStory.setUser(user);
		createdStory.setTimeStamp(LocalDateTime.now());
		return storyRepository.save(createdStory);
	}

	@Override
	public List<Story> findStoryByUserId(int userId) throws UserException {
		User user=userService.findUserById(userId);
		List<Story> stories=storyRepository.findByUserId(userId);
		return stories;
	}
	
	@Override
	public void deleteStory(int storyId, int userId) throws UserException {

	    Story story = storyRepository.findById(storyId)
	            .orElseThrow(() -> new UserException("Story not found"));

	    // ensure only owner can delete
	    if (story.getUser().getId() != userId) {
	        throw new UserException("You are not allowed to delete this story");
	    }

	    storyRepository.delete(story);
	}

	@Override
    public List<Story> findStoriesByFollowingUsers(User reqUser) throws UserException {
        // Get fresh user data with followings
        User user = userService.findUserById(reqUser.getId());
        
        List<Integer> userIds = new ArrayList<>();
        userIds.add(user.getId()); // Include current user's stories
        
        // Add all users that the current user follows
        // Note: getFollowings() returns List<Integer> (user IDs)
        if (user.getFollowings() != null && !user.getFollowings().isEmpty()) {
            userIds.addAll(user.getFollowings());
        }
        
        // FIX: Use findByUserIds (plural) not findByUserId (singular)
        List<Story> allStories = storyRepository.findByUserIds(userIds);
        
        // Sort by timestamp (newest first) - already done in query, but double-check
        allStories.sort((s1, s2) -> s2.getTimeStamp().compareTo(s1.getTimeStamp()));
        
        return allStories;
    }

}
