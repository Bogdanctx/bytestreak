package com.bytestreak.backend.dto;

import java.util.List;

import lombok.Data;

@Data
public class PostCreateDTO {
    private String text;
    private List<AttachmentDTO> attachments;
}
