package com.bytestreak.backend.services;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bytestreak.backend.entities.Quiz;
import com.bytestreak.backend.exceptions.OllamaGenerationException;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.CodeExecution;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.QuizRepository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

@Service
public class QuizService {
    @Autowired
    private CodeExecution codeExecution;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private StreakService streakService;

    @Autowired
    private ActivityTrackerService activityTrackerService;

    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(30)).build();

    public Quiz generateQuiz(String programmingLanguage, String customTopic) {
        if (programmingLanguage == null || programmingLanguage.isEmpty()) {
            programmingLanguage = "Any";
        }

        if (programmingLanguage.equalsIgnoreCase("any")) {
            programmingLanguage = Math.random() > 0.5 ? "Python" : "C++";
        }

        int judge0LangId = programmingLanguage.equals("Python") ? 71 : 54;

        List<String> pythonTopics = List.of("list comprehensions", "generators", "decorators", "regular expressions",
            "recursion", "binary search", "dynamic programming", "exceptions handling", "classes and objects",
            "inheritance", "polymorphism", "abstract base classes", "loops and conditionals",
            "global vs local variables", "graph algorithms", "string manipulation", "stack",
            "queue", "sort algorithms", "greedy algorithms", "bit manipulation"
        );
        List<String> cppTopics = List.of("pointers and references", "recursion", "binary search", "dynamic programming",
            "exceptions handling", "classes and objects", "inheritance", "polymorphism",
            "abstract classes and interfaces", "loops and conditionals", "graph algorithms", "string manipulation",
            "stack", "queue", "sort algorithms", "greedy algorithms",
            "bit manipulation", "memory management"
        );

        boolean quizGenerated = false;
        // quiz generation pipeline with retries
        for(int i = 0; i < 3; i++) {
            String randomTopic = null;
            if (programmingLanguage.equals("Python")) {
                randomTopic = pythonTopics.get((int)(Math.random() * pythonTopics.size()));
            } 
            else {
                randomTopic = cppTopics.get((int)(Math.random() * cppTopics.size()));
            }

            if (customTopic != null && !customTopic.isEmpty()) {
                randomTopic = customTopic;
            }

            // prompt generation for code snippet
            String snippetPrompt = "You are an expert " + programmingLanguage + " developer.\n" +
                            "Create a complete, runnable " + programmingLanguage + " program demonstrating: " + randomTopic + ".\n\n" +

                            "Requirements:\n" +
                            "1. The code may be deterministic and include a correct behavior related to the topic.\n" +
                            "2. Keep the program concise (max 40-50 lines).\n" +
                            "3. Define all imports, classes, and variables. No undeclared entities.\n" +
                            "4. It must execute cleanly and print exactly one line of output.\n" +
                            "5. Do not include comments.\n" +
                            "6. If C++, include main(). If Python, include executable top-level code.\n\n" +

                            "Output format:\n" +
                            "Return ONLY valid JSON with this structure:\n" +
                            "{\"codeSnippet\": \"...\"}\n" +
                            "The code must be properly escaped for JSON.\n\n";

            
            try {
                // call Ollama API to get the code snippet
                String snippetAnswer = callOllama(snippetPrompt);
                JSONObject snippetJson = new JSONObject(snippetAnswer);
                
                String snippet = snippetJson.getString("codeSnippet");

                // execute the code snippet to get the correct answer
                String correctAnswer = codeExecution.executeSnippetForStdout(judge0LangId, snippet);

                if (correctAnswer.isEmpty()) {
                    System.out.println("Execution of the generated code snippet did not produce any output. Regenerating...");
                    continue; // regenerate if no output
                }

                // prompt generation for distractors
                String distractorsPrompt = "Here is a " + programmingLanguage + " code:\n" + snippet + "\n\nThe correct output is: " + correctAnswer + 
                                        "\nGenerate 3 plausible but incorrect outputs. Output STRICTLY as JSON with distractors as STRING: {\"distractors\": [\"distractor1\", \"distractor2\", \"distractor3\"]}";
                
                // call Ollama API to get distractors
                String distractorsAnswer = callOllama(distractorsPrompt);
                JSONObject distractorsJson = new JSONObject(distractorsAnswer);

                System.out.println("Distractors response from Ollama API: " + distractorsJson);

                List<String> distractors = Arrays.asList(
                    distractorsJson.getJSONArray("distractors").getString(0),
                    distractorsJson.getJSONArray("distractors").getString(1),
                    distractorsJson.getJSONArray("distractors").getString(2)
                );


                // create the quiz
                quizGenerated = true;
                Quiz quiz = new Quiz(snippet, programmingLanguage, distractors, correctAnswer, 0);
                return quiz;
            } 
            catch (Exception e) {
                throw new OllamaGenerationException("Error during quiz generation: " + e.getMessage());
            }
        }

        if (!quizGenerated) {
            throw new OllamaGenerationException("Failed to generate a valid quiz after multiple attempts");
        }

        return null;
    }

    public List<Quiz> generateBulkQuizzes(int count) {
        List<Quiz> quizzes = new ArrayList<>();
        
        for(int i = 0; i < count; i++) {
            try {
                Quiz quiz = generateQuiz(null, null);
                quizzes.add(quiz);
            } 
            catch (Exception e) {
                System.out.println("Error generating quiz " + (i+1) + ": " + e.getMessage());
                return quizzes; // return the quizzes generated so far
            }
        }

        return quizzes;
    }

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
        
        // return the "response" field which should contain the generated content
        return jsonResponse.getString("response");
    }

    public boolean solveDailyQuiz(Long quizId, String submittedAnswer, String accountEmail) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new RuntimeException("Quiz not found"));
        boolean isCorrect = quiz.getCorrectAnswer().trim().equals(submittedAnswer.trim());
        Account solver = accountRepository.findByEmail(accountEmail);

        LocalDate today = LocalDate.now(ZoneOffset.UTC);

        if (today.equals(solver.getLastDailyQuizDate())) {
            return false;
        }

        if (isCorrect) {
            solver.setCurrentXP(solver.getCurrentXP() + 30);
            solver.setCoins(solver.getCoins() + 10);
        }

        solver.setLastDailyQuizDate(today);
        accountRepository.save(solver);
        activityTrackerService.recordActivity(solver);

        streakService.handleSolvedDailyQuiz(solver, isCorrect);

        return isCorrect;
    }
}