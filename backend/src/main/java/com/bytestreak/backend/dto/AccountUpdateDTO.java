package com.bytestreak.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AccountUpdateDTO {
    private String username;
    private String email;
    private String password;
    private String profilePictureUrl;
}