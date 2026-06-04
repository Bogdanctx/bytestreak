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

        List<String> pythonTopics = List.of(
            // Core Python & Syntax
            "list comprehensions", "dictionary comprehensions", "generator functions (yield)", 
            "decorators", "regular expressions", "exceptions handling (try/except/finally)", 
            "global vs local scope",
            // OOP
            "classes and instance variables", "inheritance and super()", "polymorphism", 
            "abstract base classes (abc module)",
            // Data Structures
            "stack operations using lists", "queue operations using collections.deque",
            // Specific Algorithms
            "recursion base cases", "binary search on a sorted list", 
            "merge sort", "quick sort", "insertion sort",
            "DFS (Depth-First Search) on graphs", "BFS (Breadth-First Search) on graphs", "topological sorting",
            "dynamic programming (memoization)", "dynamic programming (tabulation)", "0/1 knapsack problem",
            "greedy algorithm (activity selection)", 
            "bit manipulation (counting set bits)", "string manipulation (anagrams/palindromes)"
        );

        List<String> cppTopics = List.of(
            // Core C++ & Memory
            "pointer arithmetic and dereferencing", "pass by reference vs pass by value", 
            "exceptions handling (try/catch)", "memory management (new/delete)", 
            "smart pointers (std::unique_ptr, std::shared_ptr)", "RAII paradigm",
            // OOP
            "classes and encapsulation", "inheritance", "polymorphism (virtual functions)", 
            "abstract classes and pure virtual functions",
            // Data Structures
            "std::stack operations", "std::queue operations", "std::vector manipulation",
            // Specific Algorithms
            "recursion base cases", "binary search", 
            "merge sort", "quick sort", "insertion sort",
            "DFS (Depth-First Search)", "BFS (Breadth-First Search)", "Dijkstra's shortest path",
            "dynamic programming (memoization)", "dynamic programming (tabulation)", "longest common subsequence",
            "greedy algorithm (coin change)", 
            "bit manipulation (XOR/bitwise AND)", "string manipulation (std::string methods)"
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

                            "CRITICAL REQUIREMENTS:\n" +
                            "1. The code is deterministic and include a correct behavior related to the topic.\n" +
                            "2. Define all imports, classes, and variables. No undeclared entities.\n" +
                            "3. It must execute cleanly and print exactly ONE line of output.\n" +
                            "4. STRICTLY PROHIBITED: Do not include ANY comments (no //, no #, no /* */).\n" +
                            "5. If C++, include main(). If Python, include executable top-level code.\n\n" +

                            "OUTPUT FORMAT:\n" +
                            "You must return ONLY a raw JSON object. Do not wrap it in markdown blocks. Do not add conversational text.\n" +
                            "{\"codeSnippet\": \"<your_code_here>\"}\n";

            
            try {
                // call Ollama API to get the code snippet
                String snippetAnswer = callOllama(snippetPrompt);
                System.out.println("Code snippet response from Ollama API: " + snippetAnswer);
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
        LogsService.log("Calling Ollama API with prompt: " + prompt);

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

        if (solver.isSolvedDailyQuizToday()) {
            return false;
        }

        if (isCorrect) {
            solver.setCurrentXP(solver.getCurrentXP() + 30);
            solver.setCoins(solver.getCoins() + 10);
        }

        solver.setSolvedDailyQuizToday(true);
        solver.setQuizzesSolved(solver.getQuizzesSolved() + 1);
        accountRepository.save(solver);
        activityTrackerService.recordActivity(solver);

        streakService.handleSolvedDailyQuiz(solver, isCorrect);

        return isCorrect;
    }
}