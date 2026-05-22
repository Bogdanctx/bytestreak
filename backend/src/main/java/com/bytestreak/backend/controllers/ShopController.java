package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


enum Effect {
    NONE(0, "None", 0),
    FIRE(1, "Fire", 100),
    ICE(2, "Ice", 200),
    LIGHTNING(3, "Lightning", 300),
    QUANTUM_PULSE(4, "Quantum Pulse", 500);

    private final int id;
    private final String name;
    private final int price;

    Effect(int id, String name, int price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getPrice() {
        return price;
    }
}

@RestController
@RequestMapping("/api/shop")
public class ShopController {
    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/buy/{effectId}")
    public ResponseEntity<?> purchaseEffect(@PathVariable int effectId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account account = accountRepository.findByEmail(authentication.getName());
        if (account == null) {
            return ResponseEntity.status(404).body("Account not found");
        }

        if (account.getPurchasedEffects() != null && account.getPurchasedEffects().contains(effectId)) {
            return ResponseEntity.badRequest().body("Effect already purchased");
        }

        Effect effectToPurchase = null;
        for (Effect effect : Effect.values()) {
            if (effect.getId() == effectId) {
                effectToPurchase = effect;
                break;
            }
        }

        if (effectToPurchase == null) {
            return ResponseEntity.badRequest().body("Effect not found");
        }

        if (account.getCoins() < effectToPurchase.getPrice()) {
            return ResponseEntity.badRequest().body("Not enough coins");
        }

        account.setCoins(account.getCoins() - effectToPurchase.getPrice());
        account.getPurchasedEffects().add(effectId);
        accountRepository.save(account);

        return ResponseEntity.ok().body("Effect purchased successfully");
    }

    @PutMapping("/activate/{effectId}")
    public ResponseEntity<?> activateEffect(@PathVariable int effectId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account account = accountRepository.findByEmail(authentication.getName());
        if (account == null) {
            return ResponseEntity.status(404).body("Account not found");
        }

        if (account.getPurchasedEffects() == null || !account.getPurchasedEffects().contains(effectId)) {
            return ResponseEntity.badRequest().body("Effect not purchased");
        }

        account.setActiveEffect(effectId);
        accountRepository.save(account);

        return ResponseEntity.ok().body("Effect activated successfully");

    }
}
