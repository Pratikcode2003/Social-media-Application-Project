package com.social.service;

import java.util.List;

import com.social.exception.ChatException;
import com.social.model.Message;
import com.social.model.User;

public interface MessageService {
	
	public Message createMessage(User user,int chatId, Message req) throws ChatException;
	
	public List<Message> findChatsMessages(int chatId) throws ChatException;
	
	
}
