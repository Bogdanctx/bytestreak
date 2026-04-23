package com.bytestreak.backend.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;

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

    public String saveTestCases(String slug, String jsonContent) throws IOException {
        Path problemDirectory = root.resolve(slug);
        Files.createDirectories(problemDirectory);

        JSONParser parser = new JSONParser(jsonContent);
            
        try {
            ArrayList<?> jsonObject = (ArrayList<?>) parser.parse();
            Object[] tests = jsonObject.toArray();

            for(int i = 0; i < tests.length; i++) {
                LinkedHashMap<String, Object> test = ((LinkedHashMap<String, Object>) tests[i]);

                String fileName = (String) test.get("fileName");
                String input = (String) test.get("input");
                String output = (String) test.get("output");

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
                        testCases.add(new TestCaseDTO(fileName, input, output));
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
