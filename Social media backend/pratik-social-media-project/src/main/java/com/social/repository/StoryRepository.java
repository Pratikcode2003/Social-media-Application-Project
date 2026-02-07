package com.social.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.social.model.Story;

public interface StoryRepository extends JpaRepository<Story, Integer>{
	
	public List<Story> findByUserId(int userId);
	
	
    @Query("SELECT s FROM Story s WHERE s.user.id IN :userIds ORDER BY s.timeStamp DESC")
    public List<Story> findByUserIds(@Param("userIds") List<Integer> userIds);

	
}
