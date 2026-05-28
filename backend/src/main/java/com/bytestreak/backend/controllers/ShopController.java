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


enum Effect {
    NONE("cssEffectNone", 0),
    FIRE("cssEffectFire", 100),
    ICE("cssEffectIce", 200),
    LIGHTNING("cssEffectLightning", 300),
    QUANTUM_PULSE("cssEffectQuantumPulse", 500);

    private final String name;
    private final int price;

    Effect(String name, int price) {
        this.name = name;
        this.price = price;
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

    @PostMapping("/buy/{cssEffectStyle}")
    public ResponseEntity<?> purchaseEffect(@PathVariable String cssEffectStyle, Authentication authentication) {
        Account account = accountRepository.findByEmail(authentication.getName());

        if (account.getPurchasedEffects() != null && account.getPurchasedEffects().contains(cssEffectStyle)) {
            return ResponseEntity.badRequest().body("Effect already purchased");
        }

        Effect effectToBuy = null;
        for (Effect effect : Effect.values()) {
            if (effect.getName().equals(cssEffectStyle)) {
                effectToBuy = effect;
                break;
            }
        }

        if (effectToBuy == null) {
            return ResponseEntity.badRequest().body("Invalid effect");
        }

        if (account.getCoins() < effectToBuy.getPrice()) {
            return ResponseEntity.badRequest().body("Insufficient coins");
        }

        account.setCoins(account.getCoins() - effectToBuy.getPrice());
        account.getPurchasedEffects().add(cssEffectStyle);
        accountRepository.save(account);

        return ResponseEntity.ok().body("Effect purchased successfully");
    }

    @PutMapping("/activate/{cssEffectStyle}")
    public ResponseEntity<?> activateEffect(@PathVariable String cssEffectStyle, Authentication authentication) {
        Account account = accountRepository.findByEmail(authentication.getName());

        if (account.getPurchasedEffects() == null || !account.getPurchasedEffects().contains(cssEffectStyle)) {
            return ResponseEntity.badRequest().body("Effect not purchased");
        }

        account.setCssEffectStyle(cssEffectStyle);
        accountRepository.save(account);

        return ResponseEntity.ok().body("Effect activated successfully");

    }
}
