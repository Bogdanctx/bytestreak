package com.bytestreak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StreakInfoDTO {
    private String friendUsername;
    private String friendProfilePictureUrl; // base64
    private int currentStreakLength;    
}
