import { Box, Typography } from '@mui/material';
import { type IQuiz } from '../../../../types/quiz.types';
import './QuizManagementCard.style.css';

interface QuizManagementCardProps {
    quiz: IQuiz;
}

export default function QuizManagementCard({ quiz }: QuizManagementCardProps) {
    if (!quiz) {
        return null;
    }

    const badgeClass = quiz.programmingLanguage === 'Python' ? 'pending' : 'approved';

    return (
        <Box className="quiz-preview-root">
            <Box className="quiz-preview-header">
                <Typography className="quiz-preview-title">
                    Quiz Preview
                </Typography>
                <Box className={`quiz-preview-badge ${badgeClass}`}>
                    {quiz.programmingLanguage}
                </Box>
            </Box>
            
            <Box className="quiz-preview-body">
                <Box className="quiz-code-section">
                    <Typography className="quiz-section-label">Source Code</Typography>
                    <Box className="quiz-preview-code">
                        {quiz.codeSnippet}
                    </Box>
                </Box>
            
                <Box className="quiz-answers-section">
                    <Typography className="quiz-section-label">Possible Answers</Typography>
                    <Box className="quiz-answers-grid">
                        
                        <Box className="quiz-answer-box correct">
                            <Box className="quiz-answer-indicator correct" />
                            <Typography className="quiz-answer-text">{quiz.correctAnswer}</Typography>
                        </Box>

                        {quiz.distractors?.map((answer, index) => (
                            <Box key={index} className="quiz-answer-box">
                                <Box className="quiz-answer-indicator" />
                                <Typography className="quiz-answer-text">{answer}</Typography>
                            </Box>
                        ))}

                    </Box>
                </Box>

            </Box>
        </Box>
    );
}