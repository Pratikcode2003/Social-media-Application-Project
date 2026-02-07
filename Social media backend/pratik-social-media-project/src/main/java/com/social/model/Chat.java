package com.social.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Chat {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	
	private String chat_name;
	
	private String chat_image;
	
	@ManyToMany
	List<User> users=new ArrayList<>();
	
	private LocalDateTime timestamp;
	
	@OneToMany(mappedBy="chat" ,cascade = CascadeType.ALL, orphanRemoval = true)  //we used mappedBy = chat because it will not create separate table as message_chat means we don't want to create a separate table
	private List<Message> messages=new ArrayList<>();
}
