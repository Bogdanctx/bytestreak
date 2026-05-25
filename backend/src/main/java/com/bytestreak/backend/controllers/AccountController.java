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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;


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
import java.util.HashMap;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private AccountService accountService;

    @GetMapping("/get")
    public Account getAccount(@RequestParam Long accountId, Authentication authentication) {
        return accountRepository.findById(accountId).orElse(null);
    }

    @GetMapping("/fetch-accounts")
    public ResponseEntity<?> getAllAccounts(@RequestParam(required = false) String query, @RequestParam(required = false) Long cursor, Authentication authentication) {
        Map<String, Object> response = accountService.fetchAccountsWithCursor(query, cursor, authentication.getName());

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/update")
    public ResponseEntity<?> updateAccount(@RequestBody AccountUpdateDTO updates, Authentication authentication) {
        try {
            Account updatedAccount = accountService.updateAccount(updates, authentication);
            return ResponseEntity.ok(updatedAccount);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id, Authentication authentication) {
        Account targetAccount = accountRepository.findById(id).orElse(null);

        if (targetAccount == null) {
            return ResponseEntity.notFound().build();
        }

        accountRepository.delete(targetAccount);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/set-role")
    public ResponseEntity<?> setUserRole(@RequestBody AccountSetRoleDTO body, Authentication authentication) {
        try {
            accountService.setUserRole(body.getAccountId(), body.getNewRole());
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable String username, Authentication authentication) {
        UserProfileDTO userProfile = accountService.getUserProfile(username);
        
        return ResponseEntity.ok(userProfile);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String query,
            Authentication authentication) 
    {
        Account me = accountRepository.findByEmail(authentication.getName());
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Account> topAccounts;

        if (query == null || query.isBlank()) {
            topAccounts = accountRepository.findAllByOrderByCurrentXPDesc(pageable);

            for (int i = 0; i < topAccounts.getContent().size(); i++) {
                long globalRank = page * size + i + 1;
                topAccounts.getContent().get(i).setGlobalRank(globalRank);
            }
        } 
        else {
            topAccounts = accountRepository.findByUsernameStartingWithIgnoreCaseOrderByCurrentXPDesc(query.trim(), pageable);
        
            for (Account acc : topAccounts.getContent()) {
                long realRank = accountRepository.countByCurrentXPGreaterThan(acc.getCurrentXP()) + 1;
                acc.setGlobalRank(realRank);
            }
        }

        Long myRank = accountRepository.countByCurrentXPGreaterThan(me.getCurrentXP()) + 1;

        Map<String, Object> response = new HashMap<>();
        response.put("accounts", topAccounts.getContent());
        response.put("totalPages", topAccounts.getTotalPages());
        response.put("myRank", myRank);
        response.put("myAccount", me);

        return ResponseEntity.ok(response);
    }
}
