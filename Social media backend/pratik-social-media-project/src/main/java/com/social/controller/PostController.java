package com.social.controller;

import java.util.List;
import java.util.Set;

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

import com.social.exception.PostException;
import com.social.exception.UserException;
import com.social.model.Post;
import com.social.model.User;
import com.social.response.ApiResponse;
import com.social.service.PostService;
import com.social.service.UserService;

@RestController
public class PostController {
	@Autowired
	PostService postService;
	
	@Autowired
	UserService userService;
	
	@PostMapping("/api/posts")
	public ResponseEntity<Post> createPost(@RequestHeader("Authorization") String jwt,
			@RequestBody Post post) throws UserException, PostException{
		User reqUser= userService.findUserByJwt(jwt);
		Post createdPost=postService.createNewPost(post, reqUser.getId());
		return new ResponseEntity<>(createdPost,HttpStatus.ACCEPTED);
	}
	
	
	@DeleteMapping("/api/posts/{postId}")  
	public ResponseEntity<ApiResponse> deletePost(@PathVariable int postId,@RequestHeader("Authorization") String jwt) throws UserException,PostException {  //here we created a ApiResponse class and used it here it will return a message and status because delete method can have a object to send data back so we use ApiResponse Object that contain message and status and it is passed into the responseEntity
		User reqUser= userService.findUserByJwt(jwt);
		String message=postService.deletePost(postId, reqUser.getId());
		ApiResponse res=new ApiResponse(message,true);
		return new ResponseEntity<ApiResponse>(res,HttpStatus.OK);
	}
	
	@GetMapping("/api/posts/{postId}")	
	public ResponseEntity<Post> findPostByIdHandler(@PathVariable int postId) throws PostException{
		Post post=postService.findPostById(postId);
		return new ResponseEntity<Post>(post,HttpStatus.ACCEPTED);
	}
	
	
	@GetMapping("/api/posts/user/{userId}")
	public ResponseEntity<List<Post>> findUserPost(@PathVariable int userId){
		List<Post> posts=postService.findPostByUserId(userId);
		return new ResponseEntity<List<Post>>(posts,HttpStatus.OK);
	}
	
	@GetMapping("/api/posts")
	public ResponseEntity<List<Post>> findAllPost(){
		List<Post> posts=postService.findAllPost();
		return new ResponseEntity<List<Post>>(posts,HttpStatus.OK);
	}
	
	@PutMapping("/api/posts/save/{postId}")
	public ResponseEntity<Post> savePostHandler(
	        @PathVariable int postId,
	        @RequestHeader("Authorization") String jwt
	) throws PostException, UserException {

	    User reqUser = userService.findUserByJwt(jwt);
	    Post updatedPost = postService.savedPost(postId, reqUser.getId());

	    // Return the updated POST, not the saved posts list
	    return new ResponseEntity<>(updatedPost, HttpStatus.OK);
	}

	@PutMapping("/api/posts/like/{postId}")
	public ResponseEntity<Post> likePostHandler(@PathVariable int postId,@RequestHeader("Authorization") String jwt) throws PostException,UserException{
		User reqUser=userService.findUserByJwt(jwt);
		Post post=postService.likePost(postId, reqUser.getId());
		return new ResponseEntity<Post>(post,HttpStatus.ACCEPTED);
	}
}
