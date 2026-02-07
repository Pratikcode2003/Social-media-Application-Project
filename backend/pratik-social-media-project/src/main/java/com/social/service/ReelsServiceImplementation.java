package com.social.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.social.controller.AuthController;
import com.social.exception.UserException;
import com.social.model.Reels;
import com.social.model.User;
import com.social.repository.ReelsRepository;

@Service
public class ReelsServiceImplementation implements ReelsService{

    private final AuthController authController;
	
	@Autowired
	ReelsRepository reelsRepository;
	
	@Autowired
	UserService userService;

    ReelsServiceImplementation(AuthController authController) {
        this.authController = authController;
    }
	
	@Override
	public Reels createReel(Reels reel, User user) {
		Reels createReels=new Reels();
		createReels.setTitle(reel.getTitle());
		createReels.setVideo(reel.getVideo());
		createReels.setUser(user);
		return reelsRepository.save(createReels);
	}

	@Override
	public List<Reels> findAllReels() {
		return reelsRepository.findAll();
	}

	@Override
	public List<Reels> findUserReel(int userId) throws UserException {
		userService.findUserById(userId);
		return reelsRepository.findByUserId(userId);
	}

	@Override
	public String deleteReel(long reelId, int userId) throws UserException {
		User user = userService.findUserById(userId);

        Reels reel = reelsRepository.findById(reelId)
                .orElseThrow(() -> new UserException("Reel not found"));

        if (reel.getUser().getId() != user.getId()) {
            throw new UserException("You cannot delete another user's reel");
        }

        reelsRepository.delete(reel);
        return "Reel deleted successfully";
	}
	
	@Override
	public Reels likeReel(long reelId, int userId) throws UserException {

	    Reels reel = reelsRepository.findById(reelId)
	            .orElseThrow(() -> new UserException("Reel not found"));

	    User user = userService.findUserById(userId);

	    if (reel.getLiked().contains(user)) {
	        reel.getLiked().remove(user); // unlike
	    } else {
	        reel.getLiked().add(user); // like
	    }

	    return reelsRepository.save(reel);
	}

	
}
