# ByteStreak

> A modern competitive programming platform that combines algorithmic problem solving, AI-generated quizzes, gamification, and social interaction.

## Overview

ByteStreak is a full-stack web application designed to make learning competitive programming more engaging through gamification and community features.

Unlike traditional online judges that focus exclusively on solving programming problems, ByteStreak introduces:

- 🧠 AI-generated daily programming quizzes
- 🏆 Experience, levels, rankings, and virtual currency
- 🔥 Daily streaks (individual and collaborative)
- 👥 Social features including posts, messaging, and friendships
- ⚡ Secure online code execution using Judge0
- 🤖 Automatic quiz generation powered by Large Language Models

This project was developed as a Bachelor's Thesis at the **University of Bucharest, Faculty of Mathematics and Computer Science (2026).**

---

# Features

## Competitive Programming

- Create and solve programming problems
- Support for **C++** and **Python**
- Secure code execution inside sandboxed environments
- Multiple test cases
- Custom Python validators for problems with multiple valid outputs
- Markdown problem statements
- Public and private problems

---

## AI-Generated Daily Quiz

Each day users receive a programming quiz where they must determine the output of a generated code snippet.

Features include:

- Automatic code generation using **Qwen2.5-Coder**
- Automatic distractor generation
- Validation using Judge0
- Batch quiz generation
- Quiz management panel for moderators

---

## Gamification

ByteStreak keeps users motivated through:

- Experience (XP)
- Levels
- Ranks
- Virtual coins
- Leaderboards
- Daily rewards

### Ranks

| XP | Rank |
|----|------|
| 0–199 | Bit |
| 200–599 | Byte |
| 600–1499 | Kilobyte |
| 1500–2999 | Megabyte |
| 3000–5999 | Gigabyte |
| 6000+ | Terabyte |

---

## Streak System

### Individual Streak

Earned by solving the **Problem of the Day**.

### Collaborative Streak

Maintained with friends by completing the **Daily Quiz** together.

Includes:

- streak rewards
- streak freeze
- milestone bonuses

---

## Social Platform

Users can:

- Send friend requests
- Create posts
- Comment on posts
- Exchange private messages
- Upload files
- Receive notifications

Private messaging is implemented using **WebSockets** for real-time communication.

---

## Content Moderation

Moderators and administrators can:

- Review reports
- Remove inappropriate content
- Manage programming problems
- Delete abusive posts/comments/messages
- Assign user roles

---

# Technology Stack

## Frontend

- React
- TypeScript
- Material UI
- TanStack Query
- React Hook Form
- CSS

## Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- WebSocket

## Database

- PostgreSQL

## External Services

- Judge0
- Ollama
- Qwen2.5-Coder

---

# Architecture

The application follows a client-server architecture composed of four layers:

```
React + TypeScript
        │
REST API
        │
Spring Boot Backend
        │
 ├── PostgreSQL
 ├── Judge0
 └── Ollama (Qwen2.5-Coder)
```

---

# Authentication

- JWT Authentication
- HttpOnly Cookies
- BCrypt password hashing
- Password recovery via email
- Role-based authorization

Supported roles:

- User
- Creator
- Moderator
- Administrator

---

# Problem Evaluation

Solutions are evaluated through:

- Compilation
- Sandboxed execution
- Multiple test cases
- Optional custom validators written in Python

Judge0 ensures deterministic and secure execution.

---

# AI Integration

ByteStreak uses **Ollama** running **Qwen2.5-Coder (7B)** locally to:

- Generate programming quizzes
- Produce plausible incorrect answers
- Automate educational content creation

Generated programs are validated through Judge0 before becoming available to users.

---

# Virtual Economy

Users earn coins by:

- Solving daily challenges
- Maintaining streaks
- Ranking in the monthly leaderboard

Coins can be spent on:

- Streak Freeze
- Avatar visual effects

---

# Future Improvements

- Larger cloud-hosted LLMs
- Fine-tuned programming models
- Real-time coding competitions
- Mobile application
- Additional programming languages
- Contest mode

---

# Screenshots

> Add screenshots of your application here.

```
/docs/images/home.png
/docs/images/problems.png
/docs/images/editor.png
/docs/images/profile.png
/docs/images/leaderboard.png
```

---

# Installation

## Backend

```bash
cd backend

./mvnw spring-boot:run
```

## Frontend

```bash
cd frontend

npm install
npm run dev
```

---

# Requirements

- Java 21+
- Node.js
- PostgreSQL
- Judge0
- Ollama
- Qwen2.5-Coder

---

# License

This project was developed for academic purposes as part of a Bachelor's Thesis at the University of Bucharest.
