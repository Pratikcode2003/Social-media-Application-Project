package com.social.service;

import java.util.List;

import com.social.exception.UserException;
import com.social.model.User;

public interface UserService {
	public User registerUser(User newuser);
	
	public User findUserById(int userId) throws UserException;
	
	public User findUserByEmail(String email);
	
	public User followUser(int userId1,int userId2) throws UserException;
	
	User unfollowUser(int reqUserId, int userId2) throws UserException;
	
	public User updateUser(User user,int userId) throws UserException;
	
	public List<User> searchUser(String query);
	
	public User findUserByJwt(String jwt);
}
