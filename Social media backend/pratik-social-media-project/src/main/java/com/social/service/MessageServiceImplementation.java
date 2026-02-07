package com.social.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.social.exception.ChatException;
import com.social.model.Chat;
import com.social.model.Message;
import com.social.model.User;
import com.social.repository.ChatRepository;
import com.social.repository.MessageRepository;

@Service
public class MessageServiceImplementation implements MessageService{
	
	@Autowired
	private MessageRepository messageRepository;
	 
	@Autowired
	private ChatService chatService;
	
	@Autowired
	private ChatRepository chatRepository;
	@Override
	public Message createMessage(User user, int chatId, Message req) throws ChatException {
		Message message =new Message(); 
		Chat chat=chatService.findChatById(chatId);
		message.setChat(chat);
		message.setContent(req.getContent());
		message.setUser(user);
		message.setImage(req.getImage());
		message.setTimeStamp(LocalDateTime.now());
		Message savedMessage=messageRepository.save(message);
		chat.getMessages().add(savedMessage);
		chatRepository.save(chat);
		return savedMessage;
	}

	@Override
	public List<Message> findChatsMessages(int chatId) throws ChatException {
		Chat chat=chatService.findChatById(chatId);
		return messageRepository.findByChatId(chatId);
	}
	
}
