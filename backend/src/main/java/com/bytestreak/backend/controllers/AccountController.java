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
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Window;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;


import org.springframework.security.core.Authentication;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import com.bytestreak.backend.dto.AccountUpdateDTO;
import com.bytestreak.backend.dto.UserProfileDTO;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.services.AccountService;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private AccountService accountService;

    @GetMapping("/")
    public ResponseEntity<?> getAllAccounts(@RequestParam(required = false) String query, @RequestParam(required = false) Long cursor) {
        Map<String, Object> response = accountService.fetchAccounts(query, cursor);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{accountId}")
    public Account getAccount(@PathVariable Long accountId) {
        return accountRepository.findById(accountId).orElse(null);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody AccountUpdateDTO updates) {
        try {
            Account targetAccount = accountRepository.findById(id).orElse(null);

            if (targetAccount == null) {
                return ResponseEntity.notFound().build();
            }

            Account updatedAccount = accountService.updateAccount(targetAccount, updates);
            return ResponseEntity.ok(updatedAccount);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        Account targetAccount = accountRepository.findById(id).orElse(null);

        if (targetAccount == null) {
            return ResponseEntity.notFound().build();
        }

        accountRepository.delete(targetAccount);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/set-role")
    public ResponseEntity<?> setUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Account target = accountRepository.findById(id).orElse(null);

            if (target == null) {
                return ResponseEntity.notFound().build();
            }

            accountService.setUserRole(target, body.get("newRole"));
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {

        try {
            Account target = accountRepository.findByUsername(username);

            if (target == null) {
                return ResponseEntity.notFound().build();
            }

            UserProfileDTO userProfile = accountService.getUserProfile(username);
            return ResponseEntity.ok(userProfile);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard(@RequestParam(required = false) int page, @RequestParam(required = false) String query) 
    {
        Map<String, Object> response = accountService.fetchLeaderboard(query, page);
        return ResponseEntity.ok(response);
    }
}
