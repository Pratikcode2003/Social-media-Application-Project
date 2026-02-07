package com.social.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.social.exception.UserException;
import com.social.model.Story;
import com.social.model.User;
import com.social.service.StoryService;
import com.social.service.UserService;

@RestController
public class StoryController {
	@Autowired
	StoryService storyService;
	
	@Autowired
	UserService userService;
	
	@PostMapping("/api/story")
	public Story createStory(@RequestBody Story story,@RequestHeader("Authorization") String jwt) {
		User reqUser=userService.findUserByJwt(jwt);
		Story createdStory=storyService.createStory(story, reqUser);
		return createdStory;
	}
	
	@GetMapping("/api/story/user/{userId}")
	public List<Story> findUserStory(@PathVariable int userId  ,@RequestHeader("Authorization") String jwt) throws Exception {
		User reqUser=userService.findUserByJwt(jwt);
		List<Story> stories=storyService.findStoryByUserId(userId);
		return stories;
	}
	
	@DeleteMapping("/api/story/{storyId}")
    public ResponseEntity<?> deleteStory(
            @PathVariable int storyId,
            @RequestHeader("Authorization") String jwt
    ) throws UserException {

        User user = userService.findUserByJwt(jwt);
        storyService.deleteStory(storyId, user.getId());

        return ResponseEntity.ok("Story deleted successfully");
    }
	
	@GetMapping("/api/story/following")
    public List<Story> findFollowingStories(@RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserByJwt(jwt);
        List<Story> stories = storyService.findStoriesByFollowingUsers(reqUser);
        return stories;
    }

}
