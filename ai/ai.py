import random

from ollama import chat
import json

language = "C++"
topic = "polymorphism"

prompt = f"""
You are an expert {language} Developer.
Create a complete, runnable {language} program demonstrating: {topic}.

Rules:
1. The code must be conceptually tricky but perfectly valid.
2. Define all imports, classes, and variables used. No undeclared entities.
3. It must execute cleanly and print exactly one line of text to standard output.
4. Do not include any comments.
5. If the language is C++ include a main entry point. If it is Python, write the top-level executable code.

Output STRICTLY as a JSON object. Do not include markdown backticks or explanations:
{{
  "codeSnippet": "complete code here"
}}
"""

response = chat(
    model='qwen2.5-coder:7b',
    messages=[{'role': 'user', 'content': prompt}],
    format='json'
)

content = response.message.content
data = json.loads(content)

print(data['codeSnippet'])