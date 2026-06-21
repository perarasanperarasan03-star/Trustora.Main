package com.lostandfound.service;

import com.lostandfound.dto.ItemRequest;
import com.lostandfound.model.Item;
import com.lostandfound.model.User;
import com.lostandfound.repository.ItemRepository;
import com.lostandfound.repository.UserRepository;
import com.lostandfound.repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClaimRepository claimRepository;

    public Item postItem(ItemRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        Item item = new Item();
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setStatus(request.getStatus());
        item.setLocation(request.getLocation());
        item.setImageUrl(request.getImageUrl());
        item.setLatitude(request.getLatitude());
        item.setLongitude(request.getLongitude());
        item.setUser(user);
        item.setTrackingStatus("REPORTED");
        return itemRepository.save(item);
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public List<Item> getItemsByStatus(String status) {
        return itemRepository.findByStatus(status);
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found!"));
    }

    public List<Item> getItemsByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return itemRepository.findByUserId(user.getId());
    }

    public void deleteItem(Long id) {
        claimRepository.deleteAll(claimRepository.findByItemId(id));
        itemRepository.deleteById(id);
    }

    public String checkMatch(Long itemId) {
        Item reportedItem = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found!"));

        String oppositeStatus = reportedItem.getStatus().equals("LOST") ? "FOUND" : "LOST";
        List<Item> allItems = itemRepository.findByStatus(oppositeStatus);

        for (Item other : allItems) {
            if (other.getCategory() != null && reportedItem.getCategory() != null &&
                other.getCategory().equalsIgnoreCase(reportedItem.getCategory()) &&
                !other.isMatched()) {

                reportedItem.setTrackingStatus("MATCHED");
                other.setTrackingStatus("MATCHED");
                itemRepository.save(reportedItem);
                itemRepository.save(other);

                System.out.println("Match found!");
                System.out.println("Lost User: " + reportedItem.getUser().getEmail());
                System.out.println("Found User: " + other.getUser().getEmail());

                return "Match found! Please submit a claim and wait for Admin approval. After approval you will receive OTP!";
            }
        }
        return "No match found yet!";
    }

    public String verifyMatchOtp(Long itemId, String otp) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found!"));

        if (item.getMatchOtp() != null && item.getMatchOtp().equals(otp)) {
            item.setTrackingStatus("RETURNED");
            itemRepository.save(item);

            // Opposite item-லயும் RETURNED set பண்ணு
            String oppositeStatus = item.getStatus().equals("LOST") ? "FOUND" : "LOST";
            List<Item> oppositeItems = itemRepository.findByStatus(oppositeStatus);
            for (Item other : oppositeItems) {
                if (other.getCategory() != null &&
                    other.getCategory().equalsIgnoreCase(item.getCategory()) &&
                    other.isMatched()) {
                    other.setTrackingStatus("RETURNED");
                    itemRepository.save(other);
                    break;
                }
            }
            return "OTP verified! Item successfully returned!";
        }
        throw new RuntimeException("Invalid OTP!");
    }
}