package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.ProblemRepository;

import com.bytestreak.backend.dto.EditCodingProblemDTO;
import com.bytestreak.backend.dto.NewCodingProblemDTO;
import com.bytestreak.backend.dto.TestCaseDTO;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.enums.Difficulty;
import com.bytestreak.backend.enums.Role;
import com.bytestreak.backend.enums.Visibility;
import com.bytestreak.backend.exceptions.ResourceAlreadyExistsException;
import com.bytestreak.backend.exceptions.ResourceNotFoundException;
import com.bytestreak.backend.exceptions.UnauthorizedActionException;

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
            throw new ResourceNotFoundException("Creator not found");
        }

        return problemRepository.findByCreatorId(creatorId);
    }

    public Problem deleteProblem(Long problemId) throws ResourceNotFoundException {
        Problem problem = problemRepository.findById(problemId).orElse(null);

        if (problem == null) {
            throw new ResourceNotFoundException("Problem not found");
        }

        try {
            fileStorageService.deleteTestCasesDirectory(problem.getSlug());
        }
        catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Test cases directory not found during deletion: " + e.getMessage());
        }
        catch (Exception e) {
            throw new RuntimeException("Error deleting test cases directory: " + e.getMessage());
        }

        problemRepository.delete(problem);
        return problem;
    }

    public Problem createNewCodingProblem(NewCodingProblemDTO newCodingProblemDTO, Account creator) {
        String slug = newCodingProblemDTO.getTitle().toLowerCase().replace(" ", "-");

        if (problemRepository.findBySlug(slug) != null) {
            throw new ResourceAlreadyExistsException("A problem with the same title already exists");
        }

        List<TestCaseDTO> testsJSON = newCodingProblemDTO.getTestCases();
        String testCasesPath = null;
        String validationScriptPath = null;

        try {
            testCasesPath = fileStorageService.saveTestCases(slug, testsJSON);
            
            if (newCodingProblemDTO.getValidationScript() != null) {
                validationScriptPath = fileStorageService.saveValidationScript(slug, newCodingProblemDTO.getValidationScript());
            }
        } 
        catch (Exception e) {
            throw new RuntimeException("Failed to store problem data: " + e.getMessage(), e);
        }

        // 3. SALVEAZĂ ÎN BAZA DE DATE
        Problem problem = new Problem(
            newCodingProblemDTO.getTitle(),
            newCodingProblemDTO.getDescription(),
            Difficulty.valueOf(newCodingProblemDTO.getDifficulty().toString().toUpperCase()),
            newCodingProblemDTO.getCodeTemplates(),
            testCasesPath,
            validationScriptPath,
            newCodingProblemDTO.getTags(),
            creator
        );

        return problemRepository.save(problem);
    }

    public Problem editCodingProblem(Long problemId, EditCodingProblemDTO updatedProblem, Account me) {
        Problem existingProblem = problemRepository.findById(problemId)
            .orElseThrow(() -> new ResourceNotFoundException("Problem not found"));

        if (!existingProblem.getCreator().getId().equals(me.getId()) || me.getRole() != Role.MODERATOR || me.getRole() != Role.ADMIN) {
            throw new UnauthorizedActionException("You are not the creator of this problem"); 
        }

        String oldSlug = existingProblem.getSlug();
        String newSlug = updatedProblem.getTitle().toLowerCase().replace(" ", "-");

        if (!oldSlug.equals(newSlug) && problemRepository.findBySlug(newSlug) != null) {
            throw new ResourceAlreadyExistsException("A problem with the same title already exists");
        }

        try {
            fileStorageService.deleteTestCasesDirectory(oldSlug);
        } 
        catch (Exception e) {
            throw new RuntimeException("Failed to delete test cases directory: " + e.getMessage(), e);
        }

        try {
            String testCasesPath = fileStorageService.saveTestCases(newSlug, updatedProblem.getTestCases());
            existingProblem.setTestCasesPath(testCasesPath);
            
            if (updatedProblem.getValidationScript() != null && !updatedProblem.getValidationScript().isBlank()) {
                String validationScriptPath = fileStorageService.saveValidationScript(newSlug, updatedProblem.getValidationScript());
                existingProblem.setValidationScriptPath(validationScriptPath);
            } 
            else {
                existingProblem.setValidationScriptPath(null);
            }
        } 
        catch (Exception e) {
            throw new RuntimeException("Failed to store updated test cases: " + e.getMessage(), e);
        }

        existingProblem.setTitle(updatedProblem.getTitle());
        existingProblem.setSlug(newSlug);
        existingProblem.setDescription(updatedProblem.getDescription());
        existingProblem.setDifficulty(Difficulty.valueOf(updatedProblem.getDifficulty().toString().toUpperCase()));
        existingProblem.setCodeTemplates(updatedProblem.getCodeTemplates());
        existingProblem.setTags(updatedProblem.getTags());

        if (updatedProblem.getVisibility() != null) {
            existingProblem.setVisibility(Visibility.valueOf(updatedProblem.getVisibility().toString().toUpperCase()));
        }

        return problemRepository.save(existingProblem);
    }
}
