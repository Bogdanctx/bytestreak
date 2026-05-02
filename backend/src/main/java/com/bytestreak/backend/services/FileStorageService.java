package com.bytestreak.backend.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import org.apache.tomcat.util.json.JSONParser;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.dto.TestCaseDTO;

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

    public Path renameTestCasesDirectory(String oldSlug, String newSlug) {
        Path oldPath = root.resolve(oldSlug);
        Path newPath = root.resolve(newSlug);

        try {
            Files.move(oldPath, newPath);
            return newPath;
        }
        catch (IOException e) {
            throw new RuntimeException("Failed to rename test cases directory: " + e.getMessage());
        }
    }

    public String saveTestCases(String slug, String jsonContent) {
        Path problemDirectory = root.resolve(slug);

        try {
            Files.createDirectories(problemDirectory);    
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to create problem directory: " + e.getMessage());
        }
        
        JSONParser parser = new JSONParser(jsonContent);
            
        try {
            ArrayList<TestCaseDTO> jsonObject = (ArrayList<TestCaseDTO>) parser.parse();
            TestCaseDTO[] tests = jsonObject.toArray(new TestCaseDTO[0]);

            for(int i = 0; i < tests.length; i++) {
                TestCaseDTO test = tests[i];

                String fileName = test.getFileName();
                String input = test.getInput();
                String output = test.getOutput();

                Path inputPath = problemDirectory.resolve(fileName + ".in");
                Path outputPath = problemDirectory.resolve(fileName + ".out");

                Files.writeString(inputPath, input);
                Files.writeString(outputPath, output);
            }
        }
        catch (Exception e) {
            System.out.println("Error parsing JSON: " + e.getMessage());
        }

        return problemDirectory.toString();
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
                        System.out.println("Error reading test case files: " + e.getMessage());
                    }
                });
        }
        catch (IOException e) {
            System.out.println("Error listing test case directory: " + e.getMessage());
        }

        return testCases;
    }
}
