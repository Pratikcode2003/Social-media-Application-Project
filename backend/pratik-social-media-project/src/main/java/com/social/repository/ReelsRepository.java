package com.social.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.social.model.Reels;

public interface ReelsRepository extends JpaRepository<Reels, Long>{
	
	public List<Reels> findByUserId(int userId);
	
}
