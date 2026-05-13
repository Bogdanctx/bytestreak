package com.bytestreak.backend.dto;

import lombok.Data;

@Data
public class AttachmentDTO {
    private String filename;
    private String filedata; // Base64 encoded file data
}
