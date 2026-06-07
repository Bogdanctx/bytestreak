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


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import com.bytestreak.backend.dto.AccountUpdateDTO;
import com.bytestreak.backend.dto.UserProfileDTO;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.services.AccountService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private AccountService accountService;

    @GetMapping("")
    public ResponseEntity<?> getAllAccounts(@RequestParam(required = false) String query, @RequestParam(required = false) Long cursor) {
        Map<String, Object> response = accountService.fetchAccounts(query, cursor);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<?> getAccount(@PathVariable Long accountId) {
        Account account = accountRepository.findById(accountId).orElse(null);

        if (account == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(account);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody AccountUpdateDTO updates) {
        Account targetAccount = accountRepository.findById(id).orElse(null);

        if (targetAccount == null) {
            return ResponseEntity.notFound().build();
        }

        Account updatedAccount = accountService.updateAccount(targetAccount, updates);
        return ResponseEntity.ok(updatedAccount);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        Account targetAccount = accountRepository.findById(id).orElse(null);

        if (targetAccount == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            accountRepository.delete(targetAccount);
            return ResponseEntity.noContent().build();
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting account: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/set-role")
    public ResponseEntity<?> setUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Account target = accountRepository.findById(id).orElse(null);

        if (target == null) {
            return ResponseEntity.notFound().build();
        }
        if (!body.containsKey("newRole")) {
            return ResponseEntity.badRequest().body("Missing 'newRole' in request body");
        }

        accountService.setUserRole(target, body.get("newRole"));
        return ResponseEntity.ok().build();

    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        Account target = accountRepository.findByUsername(username);

        if (target == null) {
            return ResponseEntity.notFound().build();
        }

        UserProfileDTO userProfile = accountService.getUserProfile(target);
        return ResponseEntity.ok(userProfile);
    }


    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        List<Account> leaderboardAccounts = accountService.fetchLeaderboard();
        return ResponseEntity.ok(leaderboardAccounts);
    }
}
