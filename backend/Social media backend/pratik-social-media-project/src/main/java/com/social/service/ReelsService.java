package com.social.service;

import java.util.List;

import com.social.exception.UserException;
import com.social.model.Reels;
import com.social.model.User;

public interface ReelsService {
	public Reels createReel(Reels reel,User user);
	
	public List<Reels> findAllReels();
	
	public List<Reels> findUserReel(int userId) throws UserException;
	
	String deleteReel(long reelId, int userId) throws UserException;
	
	Reels likeReel(long reelId, int userId) throws UserException;
}
