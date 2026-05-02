import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import './ManageQuizzes.style.css';

interface IQuiz {
    id: string;
    codeSnippet: string;
    correctAnswer: string;
    distractors: string[];
}

function ManageQuizzes() {
    const queryClient = useQueryClient();
    const [isGenerating, setIsGenerating] = useState(false);

    const { data: quizzes = [], isLoading } = useQuery<IQuiz[]>({
        queryKey: ['adminQuizzes'],
        queryFn: async () => {
            const res = await api.get('/quizzes/drafts');
            return res.data;
        }
    });

    const generateBulk = async () => {
        setIsGenerating(true);
        try {
            await api.post('/quiz/generate-bulk'); 
            notify("Bulk generation started/completed", "success");
            queryClient.invalidateQueries({ queryKey: ['adminQuizzes'] });
        } catch (error) {
            notify("Failed to generate bulk quizzes", "error");
        }
        setIsGenerating(false);
    };

    const handleAction = async (action: 'approve' | 'reject' | 'regenerate', quizId: string) => {
        try {
            if (action === 'regenerate') {
                await api.post(`/quiz/generate?quizId=${quizId}`);
                notify("Quiz regenerated", "success");
            } else if (action === 'approve') {
                await api.post(`/quizzes/approve/${quizId}`);
                notify("Quiz approved and saved", "success");
            } else {
                await api.delete(`/quizzes/${quizId}`);
                notify("Quiz deleted", "success");
            }
            queryClient.invalidateQueries({ queryKey: ['adminQuizzes'] });
        } catch (error) {
            notify(`Action ${action} failed`, "error");
        }
    };

    if (isLoading) return <CircularProgress sx={{ color: 'var(--accent-main)' }} />;

    return (
        <Box id="manage-quizzes-container">
            <Box className="manage-quizzes-header">
                <Button variant="contained" className="admin-btn primary-btn" onClick={generateBulk} disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate Quizzes (Bulk)"}
                </Button>
                <Button variant="outlined" className="admin-btn outline-btn">
                    Create Quiz Manually
                </Button>
            </Box>

            <Box className="quiz-list">
                {quizzes.length === 0 && <Typography color="var(--text-secondary)">No pending quizzes.</Typography>}
                
                {quizzes.map((quiz) => (
                    <Box key={quiz.id} className="quiz-card">
                        <pre className="code-snippet">{quiz.codeSnippet}</pre>
                        
                        <Box className="quiz-answers">
                            <Typography className="correct-answer" sx={{ whiteSpace: 'pre-wrap' }}>
                                ✓ {quiz.correctAnswer}
                            </Typography>
                            {quiz.distractors.map((dist, idx) => (
                                <Typography key={idx} className="wrong-answer" sx={{ whiteSpace: 'pre-wrap' }}>
                                    ✗ {dist}
                                </Typography>
                            ))}
                        </Box>

                        <Box className="quiz-controls">
                            <Button className="control-btn regenerate" onClick={() => handleAction('regenerate', quiz.id)}>Regenerate</Button>
                            <Box display="flex" gap="8px">
                                <Button className="control-btn reject" onClick={() => handleAction('reject', quiz.id)}>Reject</Button>
                                <Button className="control-btn approve" onClick={() => handleAction('approve', quiz.id)}>Approve</Button>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default ManageQuizzes;