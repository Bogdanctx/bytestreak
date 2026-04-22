package com.bytestreak.backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AttachmentDTO {
    private String filename;
    private String filedata; // Base64 encoded file data
}
