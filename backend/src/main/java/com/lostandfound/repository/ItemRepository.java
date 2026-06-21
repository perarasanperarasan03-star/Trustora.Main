package com.lostandfound.repository;

import com.lostandfound.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByStatus(String status);
    List<Item> findByUserId(Long userId);
}