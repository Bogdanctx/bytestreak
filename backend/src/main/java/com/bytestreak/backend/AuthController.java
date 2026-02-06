package com.bytestreak.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections; 

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AccountRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AccountRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @CrossOrigin
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
