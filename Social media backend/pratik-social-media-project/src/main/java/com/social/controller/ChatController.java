package com.social.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.social.exception.ChatException;
import com.social.exception.UserException;
import com.social.model.Chat;
import com.social.model.User;
import com.social.request.CreateChatRequest;
import com.social.service.ChatService;
import com.social.service.UserService;

@RestController
public class ChatController {
	
	@Autowired
	private ChatService chatService;
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/api/chats")
	public Chat createChat(@RequestHeader("Authorization") String jwt,@RequestBody CreateChatRequest req) throws ChatException, UserException {
		User reqUser=userService.findUserByJwt(jwt);
		User user2=userService.findUserById(req.getUserId());
		Chat chat= chatService.createChat(reqUser, user2);
		return chat;
	}
	
	@GetMapping("/api/chats")
	public List<Chat> findUsersChat(@RequestHeader("Authorization") String jwt) {
		User user=userService.findUserByJwt(jwt);
		List<Chat> chats=chatService.findUsersChat(user.getId());
		return chats;
	}
	
	@GetMapping("/api/chats/{chatId}")
	public Chat findChatById(@RequestHeader("Authorization") String jwt,@PathVariable int chatId) throws ChatException {
		User user=userService.findUserByJwt(jwt);
		Chat chat=chatService.findChatById(chatId);
		return chat;
	}
	
	
	@DeleteMapping("/api/chats/{chatId}")
    public ResponseEntity<?> deleteChat(
            @PathVariable int chatId,
            @RequestHeader("Authorization") String jwt
    ) throws ChatException {

        User user = userService.findUserByJwt(jwt);
        chatService.deleteChat(chatId, user.getId());

        return ResponseEntity.ok("Chat deleted successfully");
    }
	
	
}
