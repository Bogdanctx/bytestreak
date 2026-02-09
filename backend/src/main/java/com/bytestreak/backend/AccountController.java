package com.bytestreak.backend;

import org.springframework.web.bind.annotation.RestController;

import tools.jackson.databind.ObjectMapper;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.List;



@RestController
@RequestMapping("/accounts")
public class AccountController {
    private final AccountRepository repository;
    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;


    public AccountController(AccountRepository repository,
                            ObjectMapper objectMapper,
                            PasswordEncoder passwordEncoder) 
    {
        this.repository = repository;
        this.objectMapper = objectMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @PatchMapping("/update")
    public ResponseEntity<?> updateAccount(@RequestBody Map<String, Object> updates, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = repository.findByEmail(authentication.getName());

        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<String> allowedFields = List.of("username", "email", "password", "profilePictureUrl");
        updates.keySet().retainAll(allowedFields);

        if(updates.containsKey("password")) {
            String rawPassword = (String) updates.get("password");
            if(rawPassword != null && !rawPassword.isEmpty()) {
                account.setPassword(passwordEncoder.encode(rawPassword));
            }
            updates.remove("password");
        }

        try {
            objectMapper.updateValue(account, updates);
            repository.save(account);

            account.setPassword(null);

            return ResponseEntity.ok(account);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid update data: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = repository.findByEmail(authentication.getName());

        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        repository.delete(account);
        return ResponseEntity.ok().build();
    
    }

}
