package com.bytestreak.backend.controllers;

import tools.jackson.databind.ObjectMapper;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.GetMapping;


import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;


import java.util.Map;
import java.util.List;
import java.util.HashMap;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    @Autowired
    private AccountRepository repository;
    @Autowired
    private ObjectMapper objectMapper;
    
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping("/get")
    public Account getAccount(@RequestParam Long accountId, Authentication authentication) {
        if (authentication == null) {
            return null;
        }

        return repository.findById(accountId).orElse(null);
    }
    

    @GetMapping
    public ResponseEntity<?> getAllAccounts(@RequestParam(required = false) Long cursor) {
        int pageSize = 20;
        List<Account> accounts;
    
        if (cursor == null) {
            accounts = repository.findByIdGreaterThanOrderByIdAsc(0L, PageRequest.of(0, pageSize));
        }
        else {
            accounts = repository.findByIdGreaterThanOrderByIdAsc(cursor, PageRequest.of(0, pageSize));
        }

        Long nextCursor = null;

        if (accounts.size() == pageSize) {
            nextCursor = accounts.get(accounts.size() - 1).getId();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("accounts", accounts);
        response.put("nextCursor", nextCursor);

        return ResponseEntity.ok(response);
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
