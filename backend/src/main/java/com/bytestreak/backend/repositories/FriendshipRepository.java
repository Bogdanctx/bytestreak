package com.bytestreak.backend.repositories;

import com.bytestreak.backend.entities.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.bytestreak.backend.entities.Account;

import java.util.List;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT f FROM Friendship f WHERE f.account1 = :account OR f.account2 = :account")
    List<Friendship> findFriendshipsOfAccount(Account account);

    @Query("SELECT f FROM Friendship f WHERE (f.account1 = :account1 AND f.account2 = :account2) OR (f.account1 = :account2 AND f.account2 = :account1)")
    Friendship findByAccount1AndAccount2(Account account1, Account account2);
}
