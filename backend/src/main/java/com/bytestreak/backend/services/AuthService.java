package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.dto.LoginFormDTO;
import com.bytestreak.backend.dto.RegisterAccountDTO;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;

import org.springframework.http.HttpHeaders;

import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;
import java.util.Map;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class AuthService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private JavaMailSender mailSender;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Account getCurrentUser(Authentication authentication) {
        String email = authentication.getName();

        Account account = accountRepository.findByEmail(email);

        if (account == null) {
            throw new RuntimeException("User not found");
        }

        return account;
    }

    public Map<String, Object> loginUser(LoginFormDTO loginRequest, HttpServletResponse response) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Account account = accountRepository.findByEmail(email);

        if (account == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(password, account.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(account.getEmail());

        ResponseCookie cookie = ResponseCookie.from("bytestreak_jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("account", account);
        responseBody.put("response", response);

        return responseBody;
    }

    public Account registerUser(RegisterAccountDTO registerRequest) {
        String rawPassword = registerRequest.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        String email = registerRequest.getEmail();
        String username = registerRequest.getUsername();

        if(accountRepository.findByEmail(email) != null) {
            throw new RuntimeException("Email already in use");
        }

        Account newAccount = new Account(username, email, encodedPassword);
        accountRepository.save(newAccount);
    
        return newAccount;
    }

    public void sendMagicLink(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("bytestreakofficial@outlook.com");
        message.setTo(toEmail);
        message.setSubject("ByteStreak - Login Request");


        String loginLink = "http://localhost:5173/magic-login?token=" + token;
        message.setText("Click the link below to securely log in to your account:\n\n" + loginLink + "\n\nThis link will expire in 15 minutes.");

        mailSender.send(message);
    }
}
