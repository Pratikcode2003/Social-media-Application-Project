package com.social.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.social.exception.CommentException;
import com.social.exception.PostException;
import com.social.exception.UserException;
import com.social.model.Comment;
import com.social.model.Post;
import com.social.model.User;
import com.social.repository.CommentRepository;
import com.social.repository.PostRepository;

@Service
public class CommentServiceImplementation implements CommentService{
	
	@Autowired
	PostService postService;
	
	@Autowired
	UserService userService;
	
	@Autowired
	CommentRepository commentRepository;
	
	@Autowired
	PostRepository postRepository;

	@Override
	public Comment createComment(Comment comment, int posId, int userId) throws PostException,UserException {
		User user= userService.findUserById(userId);
		Post post=postService.findPostById(posId);
		
		
		comment.setUser(user);
		comment.setContent(comment.getContent());
		comment.setCreatedAt(LocalDateTime.now());
		Comment savedComment=commentRepository.save(comment);
		
		post.getComments().add(savedComment);
		postRepository.save(post);
		return savedComment;
	}

	@Override
	public Comment findCommentById(int commentId) throws CommentException {
		// TODO Auto-generated method stub
		Optional<Comment> opt=commentRepository.findById(commentId);
		if(opt.isEmpty()) {
			throw new CommentException("Comment not exist");
		}
		
		return opt.get();
	}

	@Override
	public Comment likeComment(int commentId, int userid) throws CommentException,UserException {
		
		Comment comment=findCommentById(commentId);
		User user=userService.findUserById(userid);
		
		if(!comment.getLiked().contains(user)) {
			comment.getLiked().add(user);
		}else {
			comment.getLiked().remove(user);
		}
		return commentRepository.save(comment);
	}

}
