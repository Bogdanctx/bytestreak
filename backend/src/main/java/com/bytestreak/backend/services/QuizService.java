package com.bytestreak.backend.services;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bytestreak.backend.entities.Quiz;
import com.bytestreak.backend.CodeExecution;
import com.bytestreak.backend.repositories.QuizRepository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

@Service
public class QuizService {
    @Autowired
    private CodeExecution codeExecution;

    @Autowired
    private QuizRepository quizRepository;

    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(30)).build();

    public Quiz generateQuiz() {
        String randomProgrammingLanguage = Math.random() > 0.5 ? "Python" : "C++";
        int judge0LangId = randomProgrammingLanguage.equals("Python") ? 71 : 54;

        List<String> pythonTopics = List.of("list comprehensions", "decorators", "generators", "context managers", "metaclasses");
        List<String> cppTopics = List.of("inheritance", "polymorphism", "templates", "smart pointers", "lambda functions");

        String randomTopic = null;
        if (randomProgrammingLanguage.equals("Python")) {
            randomTopic = pythonTopics.get((int)(Math.random() * pythonTopics.size()));
        } else {
            randomTopic = cppTopics.get((int)(Math.random() * cppTopics.size()));
        }
        
        try {
            // prompt generation for code snippet
            String snippetPrompt = "You are an expert " + randomProgrammingLanguage + " Developer." +
                                    "Create a complete, runnable " + randomProgrammingLanguage + " program demonstrating: " + randomTopic + "." +
                                    "\n\n" +
                                    "Rules:" +
                                    "\n1. The code must be conceptually tricky but perfectly valid." +
                                    "\n2. Define all imports, classes, and variables used. No undeclared entities." +
                                    "\n3. It must execute cleanly and print exactly one line of text to standard output." +
                                    "\n4. Do not include any comments." +
                                    "\n5. If the language is C++ include a main entry point. If it is Python, write the top-level executable code." +
                                    "\n\n" +
                                    "Output STRICTLY as a JSON object. Do not include markdown backticks or explanations:" +
                                    "\n{" +
                                    "\n  \"codeSnippet\": \"complete code here\"" +
                                    "\n}" +
                                    "\n";

            // call Ollama API to get the code snippet
            String snippetAnswer = callOllama(snippetPrompt);
            JSONObject snippetJson = new JSONObject(snippetAnswer);
            
            String snippet = snippetJson.getString("codeSnippet");
            
            // execute the code snippet to get the correct answer
            String correctAnswer = codeExecution.executeSnippetForStdout(judge0LangId, snippet);

            // prompt generation for distractors
            String distractorsPrompt = "Here is a " + randomProgrammingLanguage + " code:\n" + snippet + "\n\nThe correct output is: " + correctAnswer + 
                                       "\nGenerate 3 plausible but incorrect outputs. Output STRICTLY as JSON object: {\"distractors\": [\"d1\", \"d2\", \"d3\"]}";
            
            // call Ollama API to get distractors
            String distractorsAnswer = callOllama(distractorsPrompt);
            JSONObject distractorsJson = new JSONObject(distractorsAnswer);
            System.out.println("Distractors response from Ollama API: " + distractorsJson);

            List<String> distractors = Arrays.asList(
                distractorsJson.getJSONArray("distractors").getString(0),
                distractorsJson.getJSONArray("distractors").getString(1),
                distractorsJson.getJSONArray("distractors").getString(2)
            );

            // create and save the quiz
            Quiz quiz = new Quiz(snippet, randomProgrammingLanguage, distractors, correctAnswer);
            return quizRepository.save(quiz);
        } 
        catch (Exception e) {
            throw new RuntimeException("Pipeline failed: " + e.getMessage());
        }
    }

    // Returns the content of the "response" field from the Ollama API response
    private String callOllama(String prompt) throws Exception {
        JSONObject payload = new JSONObject();
        payload.put("model", "qwen2.5-coder:7b");
        payload.put("prompt", prompt);
        payload.put("stream", false);
        payload.put("format", "json");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:11434/api/generate"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
                .build();

        String response = httpClient.send(request, HttpResponse.BodyHandlers.ofString()).body();
        JSONObject jsonResponse = new JSONObject(response);
        return jsonResponse.getString("response");
    }
}