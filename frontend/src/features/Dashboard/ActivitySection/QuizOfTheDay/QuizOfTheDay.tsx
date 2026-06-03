import { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, CircularProgress, ButtonBase } from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { api } from '../../../../api';
import { type IAccount } from '../../../../types/account.types';
import { type IStreak } from '../../../../types/streak.types';
import { type IDailyQuizForm } from '../../../../types/quiz.types';
import './QuizOfTheDay.style.css';
import AccountAvatar from '../../../../components/ui/AccountAvatar';

interface QuizOfTheDayProps {
    open: boolean;
    onClose: () => void;
    account: IAccount;
    streaks: IStreak[];
    onComplete: () => void;
}

export default function QuizOfTheDay({ open, onClose, account, streaks, onComplete }: QuizOfTheDayProps) {
    // `step` is used to manage the different states of the quiz modal: loading the quiz, showing the quiz, and showing the success screen after completion
    const [step, setStep] = useState<'LOADING' | 'QUIZ' | 'SUCCESS' | 'MISTAKE'>('LOADING');
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [answerStatus, setAnswerStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
    
    const { data: dailyQuiz, isLoading } = useQuery<IDailyQuizForm>({
        queryKey: ['dailyQuiz'],
        queryFn: async () => {
            const res = await api.get('/quizzes/daily'); 
            return res.data;
        },
        enabled: open
    });

    const submitQuizMutation = useMutation({
        mutationFn: async () => {
            if (!dailyQuiz) {
                throw new Error("Daily quiz data is not available");
            }

            const res = await api.post(`/quizzes/daily/submit-answer`, {
                quizId: dailyQuiz.id,
                selectedAnswer: selectedAnswer
            });
            return res.data;
        },
        onSuccess: (isCorrect) => {
            if (isCorrect) {
                setAnswerStatus('CORRECT');

                setTimeout(() => {
                    onComplete();
                    setStep('SUCCESS');
                }, 1000);

            } 
            else {
                setAnswerStatus('WRONG');
            
                setTimeout(() => {
                    onComplete();
                    setStep('MISTAKE');
                }, 1500);
            
            }
        }
    });
    const saveStreakMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/streaks/save-streak');
            return res.data;
        },
        onSuccess: () => {
            onComplete();
            onClose();
        },
        onError: (error) => {
            console.error("Error saving streak:", error);
        }
    });

    useEffect(() => {
        if (open) {
            if (isLoading) {
                setStep('LOADING');
            }
            else {
                setStep('QUIZ');
            }
        }
    }, [open, isLoading]);

    const handleAnswerClick = (answer: string) => {
        if (selectedAnswer || submitQuizMutation.isPending) {
            return; // prevent multiple clicks while waiting for response
        }
        
        setSelectedAnswer(answer);
        submitQuizMutation.mutate();
    };

    return (
        <Modal open={open} onClose={onClose} className="qotd-modal-wrapper">
            <Box className="qotd-modal-content">
                {step === 'LOADING' && (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress sx={{ color: 'var(--accent-main)' }} />
                    </Box>
                )}

                {step === 'QUIZ' && dailyQuiz && (
                    <Box className="qotd-fade-in">
                        <Typography variant="h5" className="qotd-title">Quiz of the Day</Typography>
                        <Box className="qotd-code-block">{dailyQuiz.codeSnippet}</Box>
                        
                        <Typography variant="caption" className="qotd-subtitle">Select the correct output:</Typography>
                        <Box className="qotd-options-grid">
                            {dailyQuiz.answerOptions.map((opt, idx) => {
                                let stateClass = '';
                                if (selectedAnswer === opt) {
                                    if (answerStatus === 'CORRECT') {
                                        stateClass = 'correct';
                                    }
                                    if (answerStatus === 'WRONG') {
                                        stateClass = 'wrong';
                                    }
                                }

                                return (
                                    <ButtonBase 
                                        key={idx} 
                                        className={`qotd-option-btn ${stateClass}`}
                                        onClick={() => handleAnswerClick(opt)}
                                        disabled={!!selectedAnswer}
                                    >
                                        {opt}
                                    </ButtonBase>
                                );
                            })}
                        </Box>
                    </Box>
                )}

                {step === 'SUCCESS' && (
                    <Box className="qotd-success-screen qotd-fade-in">
                        <CheckCircleOutlineIcon className="qotd-success-icon" />
                        <Typography variant="h4" className="qotd-title">Quiz Completed!</Typography>
                        
                        <Box className="qotd-coins-reward">
                            <Typography className="qotd-coins-text">+10 🪙</Typography>
                            <Typography className="qotd-xp-text">+30 XP</Typography>
                        </Box>

                        <Box className="qotd-streaks-list">
                            <Typography variant="caption" className="qotd-subtitle">Friends Status:</Typography>
                            {streaks.map(streak => {
                                const isMeP1 = streak.participant1.id === account.id;
                                const friend = isMeP1 ? streak.participant2 : streak.participant1;
                                
                                const friendSolvedInStreak = isMeP1 ? streak.participant2SolvedToday : streak.participant1SolvedToday;
                                const friendSolvedCorrectly = isMeP1 ? streak.participant2SolvedCorrectly : streak.participant1SolvedCorrectly;

                                return (
                                    <Box key={streak.id} className="qotd-streak-item">
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <AccountAvatar avatarUrl={friend.profilePictureUrl} cssEffectStyle={friend.cssEffectStyle} width={32} height={32} />

                                            <Typography color="var(--text-primary)">{friend.username}</Typography>
                                        </Box>
                                        
                                        {(friend.solvedDailyQuizToday && !friendSolvedInStreak) ? (
                                            <Typography color="var(--text-secondary)" fontSize="0.8rem">
                                                Already solved today
                                            </Typography>
                                        ) : (
                                            <>
                                                {!friendSolvedInStreak && (
                                                    <Typography color="var(--text-secondary)" fontSize="0.8rem">
                                                        Waiting for friend...
                                                    </Typography>
                                                )}

                                                {friendSolvedInStreak && !friendSolvedCorrectly && (
                                                    <Typography sx={{ color: 'var(--difficulty-hard)' }} fontSize="0.8rem">
                                                        Friend missed it 😢
                                                    </Typography>
                                                )}

                                                {friendSolvedInStreak && friendSolvedCorrectly && (
                                                    <Box className="qotd-streak-increase-anim">
                                                        <Typography color="var(--text-secondary)" sx={{ textDecoration: 'line-through', mr: 1 }}>
                                                            {streak.length - 1}
                                                        </Typography>
                                                        <Typography color="var(--accent-main)" fontWeight="bold">
                                                            {streak.length}
                                                        </Typography>
                                                        <LocalFireDepartmentIcon sx={{ color: '#ff9800', ml: 0.5 }} />
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </Box>
                                );
                            })}
                            {streaks.length === 0 && (
                                <Typography color="var(--text-secondary)" fontSize="0.85rem">You have no active streaks.</Typography>
                            )}
                        </Box>

                        <Button className="qotd-close-btn" onClick={onClose}>Awesome!</Button>
                    </Box>
                )}
                {step === 'MISTAKE' && (
                    <Box 
                        className="qotd-mistake-screen qotd-fade-in" 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            textAlign: 'center',
                            gap: 2,
                            p: 3
                        }}
                    >
                        <SentimentDissatisfiedIcon sx={{ fontSize: 64, color: 'var(--text-secondary)' }} />
                        
                        <Box>
                            <Typography variant="h4" className="qotd-title" sx={{ fontWeight: 700, mb: 1 }}>
                                Not Quite...
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
                                Your answer was incorrect.
                            </Typography>
                        </Box>

                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1, 
                                px: 2, 
                                py: 1, 
                                mt: 1,
                                borderRadius: 2, 
                                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                                border: '1px solid rgba(255, 68, 68, 0.2)'
                            }}
                        >
                            <LocalFireDepartmentIcon sx={{ color: '#FF4444' }} />
                            <Typography variant="body2" sx={{ color: '#FF4444', fontWeight: 600 }}>
                                The streak is now over!
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mt: 3, width: '100%', justifyContent: 'center' }}>
                            <Button className="qotd-accept-defeat-btn" onClick={onClose}>
                                Accept Defeat
                            </Button>

                            <Button 
                                variant="contained"
                                onClick={() => saveStreakMutation.mutate()}
                                disabled={account.coins < 200 || saveStreakMutation.isPending}
                                sx={{ 
                                    backgroundColor: '#E7BB41', // Gold coin color
                                    color: '#000',
                                    fontWeight: 700,
                                    fontFamily: '"Momo Trust Display", sans-serif',
                                    px: 3,
                                    '&:hover': {
                                        backgroundColor: '#d4a936'
                                    },
                                    '&.Mui-disabled': {
                                        backgroundColor: 'rgba(231, 187, 65, 0.2)',
                                        color: 'rgba(255, 255, 255, 0.3)'
                                    }
                                }}
                            >
                                {saveStreakMutation.isPending ? 'Saving...' : 'Save Streak (200 Coins)'}
                            </Button>
                        </Box>
                        {account.coins < 200 && (
                            <Typography variant="caption" sx={{ color: 'var(--difficulty-hard)', mt: 1 }}>
                                Not enough coins. You have {account.coins}.
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Modal>
    );
}