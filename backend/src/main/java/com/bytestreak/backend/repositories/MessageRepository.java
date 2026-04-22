package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bytestreak.backend.entities.Message;
import com.bytestreak.backend.entities.Account;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT message FROM Message message WHERE " +
            "(message.sender = :account1 AND message.receiver = :account2) OR " +
            "(message.sender = :account2 AND message.receiver = :account1) " +
            "ORDER BY message.timestamp ASC"
    )
    List<Message> findConversation(@Param("account1") Account account1, @Param("account2") Account account2); 
}
