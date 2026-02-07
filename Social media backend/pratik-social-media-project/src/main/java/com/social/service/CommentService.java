package com.social.service;

import com.social.exception.CommentException;
import com.social.exception.PostException;
import com.social.exception.UserException;
import com.social.model.Comment;

public interface CommentService {
	public Comment createComment(Comment comment,int posId,int userId) throws PostException,UserException;
	
	public Comment findCommentById(int commentId) throws CommentException;
	
	public Comment likeComment(int commentId,int userid) throws CommentException,UserException;
}
