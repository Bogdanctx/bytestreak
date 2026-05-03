export interface IQuiz {
    id: number;
    codeSnippet: string;
    programmingLanguage: string;
    distractors: string[];
    correctAnswer: string;
    queueIndex: number;
}
