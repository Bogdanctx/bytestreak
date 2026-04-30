package com.bytestreak.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Map<String, Object> fetchAccountsWithCursor(String query, Long cursor, String authenticatedUserEmail) {
        int pageSize = 20;
        Long startId = (cursor == null) ? 0L : cursor;
        List<Account> accounts;

        if (query == null || query.isBlank()) {
            accounts = accountRepository.findByIdGreaterThanOrderByIdAsc(startId, PageRequest.of(0, pageSize));
        } 
        else {
            accounts = accountRepository.findByUsernameStartingWithIgnoreCase(query, PageRequest.of(0, pageSize));
        }

        Long nextCursor = null;
        if (!accounts.isEmpty() && accounts.size() == pageSize) {
            nextCursor = accounts.get(accounts.size() - 1).getId();
        }

        Account me = accountRepository.findByEmail(authenticatedUserEmail);
        accounts.removeIf(account -> account.getId().equals(me.getId()));

        Map<String, Object> response = new HashMap<>();
        response.put("accounts", accounts);
        response.put("nextCursor", nextCursor);

        return response;
    }

    public Account updateAccount(Account account, String newUsername, String newEmail, String newPassword, String newProfilePictureUrl) {
        if (newUsername != null && !newUsername.isBlank()) {
            account.setUsername(newUsername);
        }
        if (newEmail != null && !newEmail.isBlank()) {
            account.setEmail(newEmail);
        }
        if (newPassword != null && !newPassword.isBlank()) {
            account.setPassword(passwordEncoder.encode(newPassword));
        }
        if (newProfilePictureUrl != null) {
            account.setProfilePictureUrl(newProfilePictureUrl);
        }

        accountRepository.save(account);
        return account;
    }
}