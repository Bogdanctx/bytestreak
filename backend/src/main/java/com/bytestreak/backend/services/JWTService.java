package com.bytestreak.backend.services;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import com.bytestreak.backend.entities.Account;

@Service
public class JWTService {
    private String secret = "847b14c1fe6a7add809954e0b8f44cb3e93419223e2909050f540e23865b986f";
    private long expiration = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    private SecretKey secretKey;

    public JWTService() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Account account) {
        return Jwts.builder()
                .subject(account.getEmail())
                .claim("role", account.getRole().name())
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String getRoleFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
            
                return true;
        } 
        catch (Exception e) {
            return false;
        }
    }
}
