package com.bytestreak.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ByteStreakBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(ByteStreakBackendApplication.class, args);
	}

}
