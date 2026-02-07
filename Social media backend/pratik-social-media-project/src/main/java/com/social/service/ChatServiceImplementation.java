package com.social.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.social.exception.ChatException;
import com.social.model.Chat;
import com.social.model.User;
import com.social.repository.ChatRepository;

@Service
public class ChatServiceImplementation implements ChatService{

	
	@Autowired
	ChatRepository chatRepository;
	
	@Override
	public Chat createChat(User reqUser, User user2) {
		Chat isExist= chatRepository.findChatByUsersId(user2,reqUser);
		if(isExist!=null) {
			return isExist;
		}
		Chat chat=new Chat();
		chat.getUsers().add(user2);
		chat.getUsers().add(reqUser);
		chat.setTimestamp(LocalDateTime.now());
		return chatRepository.save(chat);
	}

	@Override
	public Chat findChatById(int chatId) throws ChatException {
		Optional<Chat> chat=chatRepository.findById(chatId);
		if(chat.isEmpty()) {
			throw new ChatException("Chat not found with id-"+chatId);
		}
		return chat.get();
	}

	@Override
	public List<Chat> findUsersChat(int userId) {
	
		return chatRepository.findByUsersId(userId);
	}
	
	@Override
	public void deleteChat(int chatId, int userId) throws ChatException {

	    Chat chat = findChatById(chatId);

	    boolean isUserPartOfChat = chat.getUsers()
	        .stream()
	        .anyMatch(user -> user.getId() == userId);

	    if (!isUserPartOfChat) {
	        throw new ChatException("You are not authorized to delete this chat");
	    }

	    chatRepository.delete(chat);
	}

}
