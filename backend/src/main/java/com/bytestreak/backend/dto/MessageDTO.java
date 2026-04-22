package com.bytestreak.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class MessageDTO {
    private String text;
    private List<AttachmentDTO> attachments;
}
