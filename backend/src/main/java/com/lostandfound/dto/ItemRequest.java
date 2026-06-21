
package com.lostandfound.dto;

import lombok.Data;

@Data
public class ItemRequest {
    private String title;
    private String description;
    private String category;
    private String status;
    private String location;
    private String imageUrl;
    
    private Double latitude;
    private Double longitude;
}