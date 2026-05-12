package com.bytestreak.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AccountSetRoleDTO {
    private Long accountId;
    private String newRole;
}