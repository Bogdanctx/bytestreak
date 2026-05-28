package com.bytestreak.backend.repositories;

import com.bytestreak.backend.entities.OneTimeAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OneTimeTokenRepository extends JpaRepository<OneTimeAccessToken, Long> {
    OneTimeAccessToken findByToken(String token);
}
