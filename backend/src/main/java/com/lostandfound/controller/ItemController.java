package com.lostandfound.controller;

import com.lostandfound.dto.ItemRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import com.lostandfound.model.Item;
import com.lostandfound.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.lostandfound.repository.ItemRepository;
  

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemService itemService;
    
    @Autowired
    private ItemRepository itemRepository;
  


    @PostMapping
    public ResponseEntity<Item> postItem(@RequestBody ItemRequest request,
                                          Authentication authentication) {
        return ResponseEntity.ok(itemService.postItem(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Item>> getItemsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(itemService.getItemsByStatus(status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.ok("Item deleted!");
    }
    
    
    @GetMapping("/my-items")
    public ResponseEntity<List<Item>> getMyItems(Authentication authentication) {
        return ResponseEntity.ok(itemService.getItemsByUserEmail(authentication.getName()));
    }
    
    @GetMapping("/{id}/check-match")
    public ResponseEntity<String> checkMatch(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.checkMatch(id));
    }

    @PostMapping("/{id}/verify-otp")
    public ResponseEntity<String> verifyMatchOtp(@PathVariable Long id,
                                                  @RequestParam String otp) {
        return ResponseEntity.ok(itemService.verifyMatchOtp(id, otp));
    }
    
    @GetMapping("/{id}/exchange-partner")
    public ResponseEntity<Map<String, String>> getExchangePartner(@PathVariable Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        String oppositeStatus = item.getStatus().equals("LOST") ? "FOUND" : "LOST";
        List<Item> oppositeItems = itemRepository.findByStatus(oppositeStatus);

        for (Item other : oppositeItems) {
            if (other.getCategory() != null &&
                other.getCategory().equalsIgnoreCase(item.getCategory()) &&
                other.getMatchOtp() != null &&
                other.getMatchOtp().equals(item.getMatchOtp())) {

                Map<String, String> result = new HashMap<>();
                result.put("email", other.getUser().getEmail());
                result.put("name", other.getUser().getName());
                return ResponseEntity.ok(result);
            }
        }
        return ResponseEntity.status(404).body(Map.of("error", "Partner not found"));
    }
}

