package com.social.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.social.config.JwtProvider;
import com.social.exception.UserException;
import com.social.model.User;
import com.social.repository.UserRepository;

@Service
public class UserServiceImplementation implements UserService {

	@Autowired
	UserRepository userRepository;

	@Override
	public User registerUser(User newUser) {
		return userRepository.save(new User() {
			{
				setFirstName(newUser.getFirstName());
				setLastName(newUser.getLastName());
				setEmail(newUser.getEmail());
				setPassword(newUser.getPassword());
				setGender(newUser.getGender());
				setFollowers(new ArrayList<>());
				setFollowings(new ArrayList<>());
				setSavedPost(new HashSet<>());		}
		});
	}

	@Override
	public User findUserById(int userId) throws UserException {
		Optional<User> user = userRepository.findById(userId); // Optional means user exist or not it is optional

		if (user.isPresent()) { // isPresent() checks the object is exist or not
			return user.get(); // get() to retrive the object from
		} else {
			throw new UserException("user not exist with userid " + userId);
		}
	}

	@Override
	public User findUserByEmail(String email) {
		User user = userRepository.findByEmail(email);
		return user;
	}

	@Override
	public User followUser(int reqUserId, int userId2) throws UserException {
		User reqUser = findUserById(reqUserId);
		User user2 = findUserById(userId2);
		// we are considering user1 want to follow user2
		// if user1 want to follow user2 then user2 cha followers madhe user1 chi id
		// pass hoil

		if (reqUser.getFollowings().contains(user2.getId())) {
			throw new UserException("You already follow this user");
		}

		user2.getFollowers().add(reqUser.getId());

		// Ani user1 cha following madhe user2 chi id pass holi
		reqUser.getFollowings().add(user2.getId());

		userRepository.save(reqUser);
		userRepository.save(user2);
		return reqUser; // Apn return user1 la kelay karan user1 ch follow karnar hota
	}
	
	@Override
	public User unfollowUser(int reqUserId, int userId2) throws UserException {

	    User reqUser = findUserById(reqUserId);
	    User user2 = findUserById(userId2);

	    // If not following
	    if (!reqUser.getFollowings().contains(user2.getId())) {
	        throw new UserException("You are not following this user");
	    }

	    user2.getFollowers().remove(Integer.valueOf(reqUser.getId()));
	    reqUser.getFollowings().remove(Integer.valueOf(user2.getId()));

	    userRepository.save(user2);
	    userRepository.save(reqUser);

	    return reqUser;
	}


	@Override
	public User updateUser(User user, int userId) throws UserException {
		Optional<User> user1 = userRepository.findById(userId);
		if (user1.isEmpty()) {
			throw new UserException("user not exist with user id " + userId);
		}

		User oldUser = user1.get();

		if (user.getFirstName() != null) {
			oldUser.setFirstName(user.getFirstName());
		}
		if (user.getLastName() != null) {
			oldUser.setLastName(user.getLastName());
		}
		if (user.getEmail() != null) {
			oldUser.setEmail(user.getEmail());
		}
		if (user.getPassword() != null) {
			oldUser.setPassword(user.getPassword());
		}
		if (user.getGender() != null) {
			oldUser.setGender(user.getGender());
		}
		
		if(user.getBio()!=null) {
			oldUser.setBio(user.getBio());
		}
		
		if(user.getProfileImage()!=null) {
			oldUser.setProfileImage(user.getProfileImage());
		}
		User updatedUser = userRepository.save(oldUser);
		return updatedUser;
	}

	@Override
	public List<User> searchUser(String query) {
		return userRepository.searchUser(query);
	}

	@Override
	public User findUserByJwt(String jwt) {
		// TODO Auto-generated method stub
		String email = JwtProvider.getEmailFromJwtToken(jwt);
		User user = userRepository.findByEmail(email);
		return user;	
	}

}
