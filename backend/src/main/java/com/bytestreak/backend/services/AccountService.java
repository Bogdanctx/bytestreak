package com.bytestreak.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;

import java.util.List;

@Service
public class AccountService {
    @Autowired
    private AccountRepository repository;
}
