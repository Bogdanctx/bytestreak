export interface IQuiz {
    id: number;
    codeSnippet: string;
    programmingLanguage: string;
    distractors: string[];
    correctAnswer: string;
    queuePriority: number;
}

export interface IDailyQuizForm {
    id: number;
    codeSnippet: string;
    answerOptions: string[];
}