	package com.social.service;
	
	import java.util.List;

import com.social.exception.ChatException;
import com.social.model.Chat;
	import com.social.model.User;
	
	public interface ChatService {
		public Chat createChat(User reqUser,User user2);
		
		public Chat findChatById(int chatId) throws ChatException;
		
		public List<Chat> findUsersChat(int userId);
		
	    void deleteChat(int chatId, int userId) throws ChatException;

	}
