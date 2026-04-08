package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.entities.Problem;

@RestController
@RequestMapping("/creator")
public class CreatorController {
    private final ProblemRepository repository;

    public CreatorController(ProblemRepository repository) 
    {
        this.repository = repository;
    }


    @GetMapping("/problems")
    public List<Problem> getProblemsByCreatorId(@RequestParam Long creatorId) {
        return repository.findByCreatorId(creatorId);
    }

    
}
