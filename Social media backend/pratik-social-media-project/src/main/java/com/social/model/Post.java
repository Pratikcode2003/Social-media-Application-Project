package com.social.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Post {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String caption;
	private String image;
	private String video;

	@ManyToOne // we used many to one because multiple post can be created by one user or one
				// user can create multiple post
	private User user;

	@ManyToMany // here we used one to many because one post can be liked by multiple users but
				// multiple likes to one post can't given by one user
	private List<User> liked = new ArrayList<>();

	private LocalDateTime createdAt;

	@OneToMany
	private List<Comment> comments = new ArrayList<>();
	
	@ManyToMany(mappedBy = "savedPost")
	@JsonIgnore
	private Set<User> savedBy = new HashSet<>();


	public Post() {
		super();
	}

	

	public Post(int id, String caption, String image, String video, User user, List<User> liked,
			LocalDateTime createdAt, List<Comment> comments, Set<User> savedBy) {
		super();
		this.id = id;
		this.caption = caption;
		this.image = image;
		this.video = video;
		this.user = user;
		this.liked = liked;
		this.createdAt = createdAt;
		this.comments = comments;
		this.savedBy = savedBy;
	}



	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getVideo() {
		return video;
	}

	public void setVideo(String video) {
		this.video = video;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public List<User> getLiked() {
		return liked;
	}

	public void setLiked(List<User> liked) {
		this.liked = liked;
	}

	public List<Comment> getComments() {
		return comments;
	}

	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}
	
	
	
	public Set<User> getSavedBy() {
		return savedBy;
	}



	public void setSavedBy(Set<User> savedBy) {
		this.savedBy = savedBy;
	}

	public int getSavedCount() {
	    return savedBy.size();
	}

	@Override
	public boolean equals(Object o) {
	    if (this == o) return true;
	    if (!(o instanceof Post)) return false;
	    Post post = (Post) o;
	    return id == post.id;
	}

	@Override
	public int hashCode() {
	    return Integer.hashCode(id);
	}


}
