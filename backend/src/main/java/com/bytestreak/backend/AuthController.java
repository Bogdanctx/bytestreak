package com.bytestreak.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpHeaders;

import java.util.Collections;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AccountRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(AccountRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService) 
    {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @GetMapping("me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        Account account = repository.findByEmail(email);

        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(account);
    }
    
    
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletResponse response) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Account account = repository.findByEmail(email);

        if (account == null) {
            return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("message", "An account with the provided email does not exist."));
        }

        if (!passwordEncoder.matches(password, account.getPassword())) {
            return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("message", "Invalid email or password."));
        }

        String token = jwtService.generateToken(account.getEmail());

        ResponseCookie cookie = ResponseCookie.from("bytestreak_jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(account);
    }
    
    
    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody Account account) {
        Account existingAccount = repository.findByEmail(account.getEmail());

        if (existingAccount != null) {
            return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(Collections.singletonMap("message", "Email already in use"));
        }

        try {
            String rawPassword = account.getPassword();
            String encodedPassword = passwordEncoder.encode(rawPassword);
            account.setPassword(encodedPassword);

            account.setLevel(0);
            account.setCurrentXP(0);
            account.setProblemsSolved(0);
            account.setQuizzesSolved(0);
            account.setStreakLength(0);
            account.setFriendsCount(0);
            account.setProfilePictureUrl("");


            repository.save(account);
        } 
        catch (Exception e) {
            return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Collections.singletonMap("message", "An error occurred during registration"));
        }

        return ResponseEntity.ok(Collections.singletonMap("message", "Account registered successfully"));
    }
}
