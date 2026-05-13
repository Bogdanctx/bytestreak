package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.dto.EditCodingProblemDTO;
import com.bytestreak.backend.dto.NewCodingProblemDTO;
import com.bytestreak.backend.dto.TestCaseDTO;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.enums.Difficulty;
import com.bytestreak.backend.enums.Visibility;

import java.util.List;

@Service
public class CreatorService {
    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Problem> getProblemsByCreatorId(Long creatorId) {
        Account creator = accountRepository.findById(creatorId).orElse(null);

        if (creator == null) {
            throw new RuntimeException("Creator not found");
        }

        return problemRepository.findByCreatorId(creatorId);
    }

    public Problem deleteProblem(Long problemId) {
        Problem problem = problemRepository.findById(problemId).orElse(null);

        if (problem == null) {
            throw new RuntimeException("Problem not found");
        }

        try {
            fileStorageService.deleteTestCasesDirectory(problem.getSlug());
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to delete test cases directory: " + e.getMessage());
        }

        problemRepository.delete(problem);
        return problem;
    }

    public Problem createNewCodingProblem(NewCodingProblemDTO newCodingProblemDTO, Authentication authentication) {
        Account creator = accountRepository.findByEmail(authentication.getName());

        if (creator == null) {
            throw new RuntimeException("Creator not found");
        }

        String slug = newCodingProblemDTO.getTitle().toLowerCase().replace(" ", "-");
        List<TestCaseDTO> testsJSON = newCodingProblemDTO.getTestCases();
        String testCasesPath = null;

        try {
            testCasesPath = fileStorageService.saveTestCases(slug, testsJSON);
        } 
        catch (Exception e) {
            throw new RuntimeException("Failed to store test cases: " + e.getMessage());
        }

        if (problemRepository.findBySlug(slug) != null) {
            throw new RuntimeException("A problem with the same title already exists");
        }

        Problem problem = new Problem(
            newCodingProblemDTO.getTitle(),
            newCodingProblemDTO.getDescription(),
            Difficulty.valueOf(newCodingProblemDTO.getDifficulty().toString().toUpperCase()),
            newCodingProblemDTO.getCodeTemplates(),
            testCasesPath,
            newCodingProblemDTO.getTags(),
            creator
        );

        Problem savedProblem = problemRepository.save(problem);

        return savedProblem;
    }

    public Problem editCodingProblem(Long problemId, EditCodingProblemDTO updatedProblem, Authentication authentication) {
        Problem existingProblem = problemRepository.findById(problemId).orElse(null);

        if (existingProblem == null) {
            throw new RuntimeException("Problem not found");
        }

        Account me = accountRepository.findByEmail(authentication.getName());
        if (!existingProblem.getCreator().getId().equals(me.getId())) {
            throw new RuntimeException("You are not the creator of this problem");
        }

        String oldSlug = existingProblem.getSlug();
        String newSlug = updatedProblem.getTitle().toLowerCase().replace(" ", "-");

        if (!oldSlug.equals(newSlug) && problemRepository.findBySlug(newSlug) != null) {
            throw new RuntimeException("A problem with the same title already exists");
        }

        // delete old test cases directory and create a new one later (easier than trying to rename it and handle potential errors)
        try {
            fileStorageService.deleteTestCasesDirectory(oldSlug);
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to delete test cases directory: " + e.getMessage());
        }

        existingProblem.setTitle(updatedProblem.getTitle());
        existingProblem.setSlug(newSlug);
        existingProblem.setDescription(updatedProblem.getDescription());
        existingProblem.setDifficulty(Difficulty.valueOf(updatedProblem.getDifficulty().toString().toUpperCase()));
        existingProblem.setCodeTemplates(updatedProblem.getCodeTemplates());
        existingProblem.setTags(updatedProblem.getTags());

        List<TestCaseDTO> tests = updatedProblem.getTestCases();
        String testCasesPath = null;

        try {
            testCasesPath = fileStorageService.saveTestCases(newSlug, tests);
        } 
        catch (Exception e) {
            throw new RuntimeException("Failed to store test cases: " + e.getMessage());
        }

        existingProblem.setTestCasesPath(testCasesPath);

        if (updatedProblem.getVisibility() != null) {
            Visibility visibility = Visibility.valueOf(updatedProblem.getVisibility().toString().toUpperCase());
            existingProblem.setVisibility(visibility);
        }

        return problemRepository.save(existingProblem);
    }
}
