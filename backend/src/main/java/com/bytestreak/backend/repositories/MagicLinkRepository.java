package com.bytestreak.backend.repositories;

import com.bytestreak.backend.entities.MagicLinkToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MagicLinkRepository extends JpaRepository<MagicLinkToken, Long> {
    MagicLinkToken findByToken(String token);
}
