package com.bytestreak.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class OllamaGenerationException extends RuntimeException {
    public OllamaGenerationException(String message) {
        super(message);
    }
    
}
