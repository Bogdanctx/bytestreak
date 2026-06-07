package com.bytestreak.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class PostCommentDTO {
    private String text;
    private List<AttachmentDTO> attachments;
}
