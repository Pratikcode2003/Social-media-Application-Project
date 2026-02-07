package com.social.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.social.exception.UserException;
import com.social.model.Reels;
import com.social.model.User;
import com.social.response.ApiResponse;
import com.social.service.ReelsService;
import com.social.service.UserService;

@RestController
public class ReelsController {

	@Autowired
	ReelsService reelsService;
	
	@Autowired
	UserService userService;
	
	@PostMapping("/api/reels")
	public Reels createReels(@RequestBody Reels reel ,@RequestHeader("Authorization") String jwt) {
		User user=userService.findUserByJwt(jwt);
		Reels createdReels=reelsService.createReel(reel, user);
		return createdReels;
	}
	
	@GetMapping("/api/reels")
	public List<Reels> findAllReels(){
		List<Reels> reels=reelsService.findAllReels();
		return reels;
	}
	
	@GetMapping("/api/reels/{userId}")
	public List<Reels> findUserReel(@PathVariable int userId) throws Exception{
		List<Reels> reels=reelsService.findUserReel(userId);
		return reels;
	}
	
	@DeleteMapping("/api/reels/{reelId}")
	public ResponseEntity<ApiResponse> deleteReel(
	        @PathVariable long reelId,
	        @RequestHeader("Authorization") String jwt
	) throws UserException {

	    User user = userService.findUserByJwt(jwt);
	    String message = reelsService.deleteReel(reelId, user.getId());

	    ApiResponse response = new ApiResponse(message, true);
	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PutMapping("/api/reels/{reelId}/like")
	public Reels likeReel(
	        @PathVariable long reelId,
	        @RequestHeader("Authorization") String jwt
	) throws UserException {

	    User user = userService.findUserByJwt(jwt);
	    return reelsService.likeReel(reelId, user.getId());
	}


}
