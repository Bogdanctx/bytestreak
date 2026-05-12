package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import com.bytestreak.backend.dto.RegisterAccountDTO;

import java.util.Collections;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.dto.LoginFormDTO;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.MagicLinkToken;
import com.bytestreak.backend.repositories.MagicLinkRepository;
import com.bytestreak.backend.services.AuthService;
import com.bytestreak.backend.services.JWTService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MagicLinkRepository magicLinkRepository;

    @Autowired
    private JWTService jwtService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = authService.getCurrentUser(authentication);

        return ResponseEntity.ok(account);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("bytestreak_jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(Collections.singletonMap("message", "Logged out successfully"));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginFormDTO loginRequest, HttpServletResponse response) {
        Map<String, Object> responseBody;

        try {
            responseBody = authService.loginUser(loginRequest, response);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        
        
        response = (HttpServletResponse) responseBody.get("response");
        Account account = (Account) responseBody.get("account");

        return ResponseEntity.ok(account);
    }
    
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterAccountDTO registerRequest) {
        Account newAccount;

        try {
            newAccount = authService.registerUser(registerRequest);
        } 
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        return ResponseEntity.ok(newAccount);
    }

    @PostMapping("/request-recovery-link")
    public ResponseEntity<?> requestRecoveryLink(@RequestParam String email) {
        Account account = accountRepository.findByEmail(email);

        if (account == null) {
            return ResponseEntity.ok("If the email exists, a link was sent.");
        }

        String tokenString = UUID.randomUUID().toString();
        MagicLinkToken token = new MagicLinkToken();
        token.setToken(tokenString);
        token.setAccount(account);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(15));

        magicLinkRepository.save(token);
        authService.sendRecoveryLink(email, tokenString);
        return ResponseEntity.ok("If the email exists, a link was sent.");
    }

    @PostMapping("/recover-account")
    public ResponseEntity<?> recoverAccount(@RequestParam String token, HttpServletResponse response) {
        MagicLinkToken magicToken = magicLinkRepository.findByToken(token);

        if (magicToken == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if (magicToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            magicLinkRepository.delete(magicToken);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Account account = magicToken.getAccount();
        String jwtToken = jwtService.generateToken(account);

        ResponseCookie cookie = ResponseCookie.from("bytestreak_jwt", jwtToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        magicLinkRepository.delete(magicToken);

        return ResponseEntity.ok(account);
    }
}
