package com.bytestreak.backend;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;

import com.bytestreak.backend.dto.ExecutionResultDTO;

@Service
public class CodeExecution {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String judge0ApiUrl = "http://localhost:2358/submissions?base64_encoded=true&wait=true";

    public List<ExecutionResultDTO> executeCode(String programmingLanguage, String sourceCode, String slug, String testCasesDirectory) {
        Map<String, Integer> j0_progLanguageIds = new HashMap<>();
        j0_progLanguageIds.put("python", 71);
        j0_progLanguageIds.put("cpp", 54);

        List<ExecutionResultDTO> results = new ArrayList<>();

        Path directory = Paths.get(testCasesDirectory);
        
        try {
            List<Path> files = Files.list(directory).filter(Files::isRegularFile).toList();
            
            for(Path file: files) {
                String fileName = file.getFileName().toString();
                if (fileName.endsWith(".in")) {
                    String testCaseName = fileName.substring(0, fileName.length() - 3);
                    Path outputFile = directory.resolve(testCaseName + ".out");
                    int testCaseId = Integer.parseInt(testCaseName.replaceAll("\\D+", ""));

                    if (Files.exists(outputFile)) {
                        String input = Files.readString(file);
                        String expectedOutput = Files.readString(outputFile);

                        ExecutionResultDTO result = judge0Execute(j0_progLanguageIds.get(programmingLanguage), sourceCode, input, expectedOutput, testCaseId);
                        results.add(result);
                    }
                }
            }
        }
        catch (Exception e) {
            System.out.println("Error reading test case files: " + e.getMessage());
        }


        return results;
    }

    public ExecutionResultDTO judge0Execute(int languageId, String sourceCode, String input, String expectedOutput, int testCaseId) {
        RestTemplate restTemplate = new RestTemplate();
        
        // encode data to base64
        String encodedSource = Base64.getEncoder().encodeToString(sourceCode.getBytes());
        String encodedInput = Base64.getEncoder().encodeToString(input.getBytes());
        String encodedExpectedOutput = Base64.getEncoder().encodeToString(expectedOutput.getBytes());

        // create request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("source_code", encodedSource);
        requestBody.put("language_id", languageId);
        requestBody.put("stdin", encodedInput);
        requestBody.put("expected_output", encodedExpectedOutput);
        requestBody.put("cpu_time_limit", 2.0);
        requestBody.put("memory_limit", 128000);

        // set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            String jsonBody = objectMapper.writeValueAsString(requestBody);
            HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);

            // send request 
            ResponseEntity<Map> response = restTemplate.postForEntity(judge0ApiUrl, request, Map.class);
            Map<String, Object> responseBody = response.getBody();

            Map<String, Object> status = (Map<String, Object>) responseBody.get("status");

            System.out.println("Received response from Judge0 API: " + responseBody);

            int statusId = (int) status.get("id");
            String executionStatus = (String) status.get("description");

            float executionTime = Float.parseFloat(responseBody.get("time").toString());

            return new ExecutionResultDTO(
                statusId,
                executionStatus,
                testCaseId,
                executionTime
            );
        }
        catch (Exception e) {
            System.out.println("Error executing code: " + e.getMessage());
            return new ExecutionResultDTO(0, "System Error", testCaseId, 0);
        }
    }
}
