package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.bytestreak.backend.repositories.MessageRepository;
import com.bytestreak.backend.dto.MessageDTO;
import com.bytestreak.backend.dto.AttachmentDTO;
import com.bytestreak.backend.entities.Attachment;
import com.bytestreak.backend.entities.Message;
import com.bytestreak.backend.entities.Account;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Message sendMessage(Account sender, Account receiver, MessageDTO payload) {
        Message message = new Message();
        List<Attachment> attachments = new ArrayList<>();

        if (payload.getAttachments() != null) {
            for (AttachmentDTO attachmentDTO : payload.getAttachments()) {
                Attachment attachment = new Attachment();
                attachment.setFilename(attachmentDTO.getFilename());
                attachment.setFiledata(attachmentDTO.getFiledata());
                attachment.setMessage(message);
                attachments.add(attachment);
            }
        }

        message.setSender(sender);
        message.setReceiver(receiver);
        message.setText(payload.getText());
        message.setAttachments(attachments);

        messageRepository.save(message);

        messagingTemplate.convertAndSendToUser(receiver.getEmail(),"/user/queue/messages", message);

        return message;
    }

    public List<Message> getConversation(Account account1, Account account2) {
        return messageRepository.findConversation(account1, account2);
    }
}
