package com.social.service;

import java.util.List;

import com.social.exception.PostException;
import com.social.exception.UserException;
import com.social.model.Post;

public interface PostService {
	public Post createNewPost(Post post,int userId) throws UserException, PostException; 
	
	public String deletePost(int postId,int userId) throws PostException,UserException;
	
	public List<Post> findPostByUserId(int userId);
	
	public Post findPostById(int postId) throws PostException;
	
	public List<Post> findAllPost();
	
	public Post savedPost(int postId,int userId) throws PostException,UserException;
	
	public Post likePost(int postId,int userId) throws PostException,UserException;
	
}
