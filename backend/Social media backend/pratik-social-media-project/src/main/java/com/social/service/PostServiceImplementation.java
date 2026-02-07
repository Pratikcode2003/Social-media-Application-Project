package com.social.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.social.exception.PostException;
import com.social.exception.UserException;
import com.social.model.Post;
import com.social.model.User;
import com.social.repository.PostRepository;
import com.social.repository.UserRepository;
@Service
public class PostServiceImplementation implements PostService {

	@Autowired
	PostRepository postRepository;

	@Autowired
	UserService userService;
	
	@Autowired
	UserRepository userRepository;

	@Override
	public Post createNewPost(Post post, int userId) throws PostException, UserException {

		User user = userService.findUserById(userId);
		Post newPost = new Post();
		newPost.setCaption(post.getCaption());
		newPost.setImage(post.getImage());
		newPost.setCreatedAt(LocalDateTime.now());
		newPost.setVideo(post.getVideo());
		newPost.setUser(user);
		return postRepository.save(newPost);
	}

	@Override
	@Transactional
	public String deletePost(int postId, int userId)
	        throws PostException, UserException {

	    Post post = findPostById(postId);
	    User user = userService.findUserById(userId);

	    if (post.getUser().getId() != user.getId()) {
	        throw new UserException("You can't delete another user's post");
	    }

	    // 1️⃣ Remove saved_posts references
	    for (User u : post.getSavedBy()) {
	        u.getSavedPost().remove(post);
	    }
	    post.getSavedBy().clear();

	    // 2️⃣ Remove likes (post_liked table)
	    post.getLiked().clear();

	    // 3️⃣ Remove comments relation (post_comments table)
	    post.getComments().clear();

	    // 4️⃣ Flush relationship cleanup
	    postRepository.save(post);

	    // 5️⃣ Delete post safely
	    postRepository.delete(post);

	    return "Post deleted successfully";
	}


	@Override
	public List<Post> findPostByUserId(int userId) {
		return postRepository.findPostByUserId(userId);
	}

	@Override
	public Post findPostById(int postId) throws PostException {
		Optional<Post> post = postRepository.findById(postId);
		if (post.isEmpty()) {
			throw new PostException("Post not found with id " + postId);
		}
		return post.get();
	}

	@Override
	public List<Post> findAllPost() {
		return postRepository.findAll();
	}

	@Override
	public Post savedPost(int postId, int userId) throws PostException, UserException {
	    Post post = findPostById(postId);
	    User user = userService.findUserById(userId);

	    if (user.getSavedPost().contains(post)) {
	        user.getSavedPost().remove(post);
	        post.getSavedBy().remove(user);
	    } else {
	        user.getSavedPost().add(post);
	        post.getSavedBy().add(user);
	    }

	    userRepository.save(user);
	    postRepository.save(post);

	    return post;
	}

	
	
	@Override
	public Post likePost(int postId, int userId) throws PostException,UserException {
		Post post=findPostById(postId);
		User user=userService.findUserById(userId);
		
		if(post.getLiked().contains(user)) {  //if user already liked then it will remove used from list of liked else add it to the liked list
			post.getLiked().remove(user);
		}else {
			post.getLiked().add(user);
		}
		return postRepository.save(post);
	}

}
