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
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;

import org.json.JSONObject;

import com.bytestreak.backend.dto.ExecutionResultDTO;

@Service
public class CodeExecution {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String judge0ApiUrl = "http://localhost:2358/submissions?base64_encoded=true&wait=true";

    public List<ExecutionResultDTO> executeCode(String programmingLanguage, String sourceCode, String slug, String testCasesDirectory, String validationScriptPath) {
        Map<String, Integer> j0_progLanguageIds = new HashMap<>();
        j0_progLanguageIds.put("python", 71);
        j0_progLanguageIds.put("cpp", 54);

        List<ExecutionResultDTO> results = new ArrayList<>();

        Path directory = Paths.get(testCasesDirectory);
        
        String validationScriptCode = null;
        if (validationScriptPath != null) {
            try {
                Path vPath = Paths.get(validationScriptPath);
                if (Files.exists(vPath)) {
                    validationScriptCode = Files.readString(vPath);
                }
            } catch (Exception e) {
                System.out.println("Error reading validation script: " + e.getMessage());
            }
        }

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

                        ExecutionResultDTO result = judge0Execute(j0_progLanguageIds.get(programmingLanguage), sourceCode, input, expectedOutput, testCaseId, validationScriptCode);
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

    private ExecutionResultDTO judge0Execute(int languageId, String sourceCode, String input, String expectedOutput, int testCaseId, String validationScriptCode) {
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
            JSONObject jsonResponse = new JSONObject(response.getBody());

            int statusId = (int) jsonResponse.getJSONObject("status").getInt("id");
            String executionStatus = (String) jsonResponse.getJSONObject("status").get("description");

            if (validationScriptCode == null || (statusId != 3 && statusId != 4)) {
                return new ExecutionResultDTO(statusId, executionStatus, testCaseId); 
            }

            // VALIDATE USER OUTPUT WITH CUSTOM SCRIPT
            String base64Stdout = (String) jsonResponse.get("stdout");
            String userOutput = base64Stdout != null ? new String(Base64.getMimeDecoder().decode(base64Stdout)) : "";

            String validationStdin = input + "@@@USER_OUTPUT@@@" + userOutput;
            String encodedValidationStdin = Base64.getEncoder().encodeToString(validationStdin.getBytes());
            String encodedValidationScript = Base64.getEncoder().encodeToString(validationScriptCode.getBytes());

            Map<String, Object> validationRequestBody = new HashMap<>();
            validationRequestBody.put("source_code", encodedValidationScript);
            validationRequestBody.put("language_id", 71); 
            validationRequestBody.put("stdin", encodedValidationStdin);
            validationRequestBody.put("cpu_time_limit", 2.0);

            HttpEntity<String> validationReq = new HttpEntity<>(objectMapper.writeValueAsString(validationRequestBody), headers);
            ResponseEntity<Map> validationRes = restTemplate.postForEntity(judge0ApiUrl, validationReq, Map.class);
            JSONObject validationJsonResponse = new JSONObject(validationRes.getBody());
            String valStdoutBase64 = (String) validationJsonResponse.get("stdout");
            String valStdout = valStdoutBase64 != null ? new String(Base64.getMimeDecoder().decode(valStdoutBase64)).trim() : "";

            if ("True".equalsIgnoreCase(valStdout)) {
                return new ExecutionResultDTO(3, "Accepted", testCaseId);
            } 
            else {
                return new ExecutionResultDTO(4, "Wrong Answer", testCaseId);
            }

        }
        catch (Exception e) {
            System.out.println("Error executing code: " + e.getMessage());
            return new ExecutionResultDTO(0, "System Error", testCaseId);
        }
    }

    public String executeSnippetForStdout(int languageId, String sourceCode) {
        System.out.println("Executing code snippet with Judge0 API. Language ID: " + languageId + ", Source Code: \n" + sourceCode);
        String encodedSource = Base64.getEncoder().encodeToString(sourceCode.getBytes());

        JSONObject requestBody = new JSONObject();
        requestBody.put("source_code", encodedSource);
        requestBody.put("language_id", languageId);
        requestBody.put("cpu_time_limit", 2.0);

        HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(30)).build();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(judge0ApiUrl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .build();

        try {
            String response = httpClient.send(request, HttpResponse.BodyHandlers.ofString()).body();
            JSONObject jsonResponse = new JSONObject(response);
            JSONObject status = jsonResponse.getJSONObject("status");

            if (status.getInt("id") != 3) { // 3 = Accepted
                System.out.println("Code snippet execution failed. Status: " + status.getString("description"));
                return "";
            }

            System.out.println("Received response from Judge0 API for snippet execution: " + jsonResponse);

            String stdout = jsonResponse.optString("stdout", ""); // base64 encoded
            

            // decode stdout from base64
            if (!stdout.isEmpty()) {
                byte[] decodedBytes = Base64.getMimeDecoder().decode(stdout);
                stdout = new String(decodedBytes);
            }

            System.out.println("Decoded stdout: " + stdout);

            return stdout;
        }
        catch (Exception e) {
            throw new RuntimeException("Error executing code snippet: " + e.getMessage());
        }
    }
}
