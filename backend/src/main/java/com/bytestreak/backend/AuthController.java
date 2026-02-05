package com.bytestreak.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AccountRepository repository;

    public AuthController(AccountRepository repository) {
        this.repository = repository;
    }
    
    @PostMapping("register")
    public String register(@RequestBody Account account) {
        repository.save(account);
        return "Registration successful";
    }
}
