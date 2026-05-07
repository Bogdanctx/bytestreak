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

    return (
        <Box 
            className="quiz-card" 
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', borderTop: 'none' }}
        >
            <Box className="quiz-card-header">
                <Typography className="quiz-card-index" sx={{ fontSize: '1rem !important', color: 'var(--text-primary) !important' }}>
                    Quiz Details
                </Typography>
                <Typography className={`quiz-status-badge ${quiz.programmingLanguage === 'Python' ? 'PENDING' : 'APPROVED'}`}>
                    {quiz.programmingLanguage}
                </Typography>
            </Box>
            
            <Box className="quiz-card-body" sx={{ flex: 1, overflowY: 'auto' }}>
                <Box className="quiz-code-block">
                    {quiz.codeSnippet}
                </Box>
                
                <Typography className="quiz-section-label" mt={2}>Answers</Typography>
                <Box className="quiz-answers-grid">
                    <Box className="quiz-answer-item correct">
                        <Box className="quiz-answer-dot correct" />
                        <Typography className="quiz-answer-text">{quiz.correctAnswer}</Typography>
                    </Box>
                    {quiz.distractors.map((ans, i) => (
                        <Box key={i} className="quiz-answer-item">
                            <Box className="quiz-answer-dot" />
                            <Typography className="quiz-answer-text">{ans}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}