package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;


import org.springframework.security.core.Authentication;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import com.bytestreak.backend.dto.AccountSetRoleDTO;
import com.bytestreak.backend.dto.AccountUpdateDTO;
import com.bytestreak.backend.dto.UserProfileDTO;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.services.AccountService;

import java.util.Map;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private AccountService accountService;

    @GetMapping("/get")
    public Account getAccount(@RequestParam Long accountId, Authentication authentication) {
        if (authentication == null) {
            return null;
        }

        return accountRepository.findById(accountId).orElse(null);
    }

    @GetMapping("/fetch-accounts")
    public ResponseEntity<?> getAllAccounts(
        @RequestParam(required = false) String query, 
        @RequestParam(required = false) Long cursor,
        Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, Object> response = accountService.fetchAccountsWithCursor(query, cursor, authentication.getName());

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/update")
    public ResponseEntity<?> updateAccount(@RequestBody AccountUpdateDTO updates, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Account updatedAccount = accountService.updateAccount(updates, authentication);
            return ResponseEntity.ok(updatedAccount);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(@RequestParam(required = false) Long accountId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account targetAccount = null;

        if (accountId != null) {
            targetAccount = accountRepository.findById(accountId).orElse(null);
        
            if (targetAccount == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        }

        targetAccount = accountRepository.findByUsername(authentication.getName());

        if (targetAccount == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        accountRepository.delete(targetAccount);

        return ResponseEntity.ok().build();
    
    }

    @PutMapping("/set-role")
    public ResponseEntity<?> setUserRole(@RequestBody AccountSetRoleDTO body, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            accountService.setUserRole(body.getAccountId(), body.getRole());
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable String username, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        UserProfileDTO userProfile = accountService.getUserProfile(username);
        
        return ResponseEntity.ok(userProfile);
    }
}
