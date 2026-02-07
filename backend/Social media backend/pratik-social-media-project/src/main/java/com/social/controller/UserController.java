package com.social.controller;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.social.exception.UserException;
import com.social.model.Post;
import com.social.model.User;
import com.social.repository.UserRepository;
import com.social.service.UserService;

@RestController
public class UserController {

	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserService userService;

	
	@GetMapping("/api/users")
	public List<User> getUser() {
		List<User> users = userRepository.findAll();
		return users;
	}

	@GetMapping("/api/users/{userid}")
	public User getUser(@PathVariable("userid") int id) throws UserException {
		User user=userService.findUserById(id);
		return user;
	}

	@PutMapping("/api/users")
	public User updateUser(@RequestHeader("Authorization") String jwt,@RequestBody User user) throws UserException {
		User reqUser=userService.findUserByJwt(jwt);
		User updatedUser=userService.updateUser(user,reqUser.getId());
		return updatedUser;
	}
	
	@PutMapping("/api/users/follow/{userId2}")
	public User followUserHandler(@RequestHeader("Authorization") String jwt, @PathVariable int userId2) throws UserException {
		User reqUser=userService.findUserByJwt(jwt);
		User user=userService.followUser(reqUser.getId(), userId2);
		return user;
	}
	
	@PutMapping("/api/users/unfollow/{userId2}")
	public User unfollowUserHandler(
	        @RequestHeader("Authorization") String jwt,
	        @PathVariable int userId2
	) throws UserException {

	    User reqUser = userService.findUserByJwt(jwt);
	    return userService.unfollowUser(reqUser.getId(), userId2);
	}

	@GetMapping("/api/users/search")
	public List<User> searchUser(@RequestParam("query") String query){
		List<User> users=userService.searchUser(query);
		return users;
	}
	
	@GetMapping("/api/users/profile")
	public User getUserFromToken(@RequestHeader("Authorization") String jwt) {
//		System.out.println("jwt--- "+ jwt);
		User user= userService.findUserByJwt(jwt);
		user.setPassword(null);
		return user;
	}
	
	 @GetMapping("/api/users/saved")
	    public Set<Post> getSavedPosts(@RequestHeader("Authorization") String jwt) throws UserException {
	        User reqUser = userService.findUserByJwt(jwt);
	        return reqUser.getSavedPost();
	    }
}
