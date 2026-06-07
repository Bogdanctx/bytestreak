package com.bytestreak.backend.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.bytestreak.backend.dto.TestCaseDTO;
import com.bytestreak.backend.exceptions.ResourceNotFoundException;

import java.util.List;

@Service
public class FileStorageService {
    private final Path root = Paths.get("problem_data");

    public FileStorageService() {
        try {
            Files.createDirectories(root);
        }
        catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public String getValidationScriptContent(String validationScriptPath) {
        try {
            return Files.readString(Paths.get(validationScriptPath));
        }
        catch (IOException e) {
            throw new RuntimeException("Failed to read validation script content: " + e.getMessage());
        }
    }

    public String saveTestCases(String slug, List<TestCaseDTO> testCases) {
        Path problemDirectory = root.resolve(slug);

        try {
            Files.createDirectories(problemDirectory);    
        }
        catch (IOException e) {
            throw new RuntimeException("Failed to create problem directory for slug: " + slug, e);
        }
            
        try {
            for (TestCaseDTO test : testCases) {
                Path inputPath = problemDirectory.resolve(test.getFileName() + ".in");
                Path outputPath = problemDirectory.resolve(test.getFileName() + ".out");

                Files.writeString(inputPath, test.getInput());
                Files.writeString(outputPath, test.getOutput());
            }
        }
        catch (IOException e) {
            throw new RuntimeException("Failed to write test case files to disk for slug: " + slug, e);
        }

        return problemDirectory.toString();
    }

    public String saveValidationScript(String slug, String validationScript) throws RuntimeException {
        Path problemDirectory = root.resolve(slug);

        if (!Files.exists(problemDirectory)) {
            throw new RuntimeException("Problem directory does not exist for slug: " + slug);
        }

        Path validationScriptPath = problemDirectory.resolve("validation_script.py");

        try {
            Files.writeString(validationScriptPath, validationScript);
        }
        catch (IOException e) {
            throw new RuntimeException("Failed to save validation script: " + e.getMessage());
        }

        return validationScriptPath.toString();
    }
    

    public ArrayList<TestCaseDTO> getTestCases(String testCasesPath) {
        ArrayList<TestCaseDTO> testCases = new ArrayList<>();

        try {
            Files.list(Paths.get(testCasesPath))
                .filter(path -> path.toString().endsWith(".in"))
                .forEach(inputPath -> {
                    String fileName = inputPath.getFileName().toString().replace(".in", "");
                    Path outputPath = inputPath.getParent().resolve(fileName + ".out");

                    try {
                        String input = Files.readString(inputPath);
                        String output = Files.readString(outputPath);

                        TestCaseDTO testCase = new TestCaseDTO();
                        testCase.setFileName(fileName);
                        testCase.setInput(input);
                        testCase.setOutput(output);

                        testCases.add(testCase);
                    }
                    catch (IOException e) {
                        throw new RuntimeException("Error reading test case files: " + e.getMessage());
                    }
                });
        }
        catch (IOException e) {
            throw new RuntimeException("Error listing test case directory: " + e.getMessage());
        }

        return testCases;
    }

    public void deleteTestCasesDirectory(String slug) throws ResourceNotFoundException {
        Path problemDirectory = root.resolve(slug);

        if (Files.exists(problemDirectory)) {
            try {
                Files.walk(problemDirectory)
                    .sorted((a, b) -> b.compareTo(a))
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        }
                        catch (NoSuchFileException e) {
                            throw new ResourceNotFoundException("File not found during deletion: " + e.getMessage());
                        }
                        catch (IOException e) {
                            throw new RuntimeException("Error deleting file: " + e.getMessage());
                        }
                        catch (SecurityException e) {
                            throw new RuntimeException("Permission denied during file deletion: " + e.getMessage());
                        }
                    });
            }
            catch (Exception e) {
                throw new RuntimeException("Failed to delete test cases directory: " + e.getMessage());
            }
        }
        else {
            throw new ResourceNotFoundException("Test cases directory not found for slug: " + slug);
        }

    }
}
