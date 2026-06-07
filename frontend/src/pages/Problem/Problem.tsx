import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { api } from '../../api';
import CodeEditorWindow from '../../features/Problem/CodeEditorWindow';
import ProblemDataPanel from '../../features/Problem/ProblemDataPanel';
import { type IProblem, type ISubmissionResult } from '../../types/problem.types';
import './Problem.style.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount } from '../../hooks/useAccount';
import Loading from '../../components/ui/Loading';

function Problem() {
    const queryClient = useQueryClient();
    const problemPageRef = useRef<HTMLDivElement | null>(null);
    const { data: account, isLoading: accountQueryIsLoading } = useAccount();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState("description");
    const [results, setResults] = useState<ISubmissionResult[]>([]);
    const [solvedCodingProblem, setSolvedCodingProblem] = useState(false);
    const [problemPanelWidth, setProblemPanelWidth] = useState(600);
    const [isResizingPanels, setIsResizingPanels] = useState(false);
    const [earnedDailyChallengeReward, setEarnedDailyChallengeReward] = useState(false);

    const { data: codingProblem, isLoading } = useQuery<IProblem>({
        queryKey: ['codingProblem'],
        queryFn: async () => {
            let response = await api.get(`/problems/${id}/description`);
            
            response.data.codeTemplates = JSON.parse(response.data.codeTemplates);
            response.data.description = response.data.description.replace(/\\n/g, '\n');
            
            return response.data;
        },
    });

    useEffect(() => {

        if (activeTab === 'submissions') {
            setProblemPanelWidth(900);
        }

    }, [activeTab]);

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            if (!isResizingPanels || !problemPageRef.current) {
                return;
            }

            const pageBounds = problemPageRef.current.getBoundingClientRect();
            const leftBoundary = 320;
            const rightBoundary = Math.max(leftBoundary, pageBounds.width);
            const nextWidth = event.clientX - pageBounds.left;
            const constrainedWidth = Math.min(Math.max(nextWidth, leftBoundary), rightBoundary);

            setProblemPanelWidth(constrainedWidth);
        };

        const handlePointerUp = () => {
            setIsResizingPanels(false);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isResizingPanels]);

    if (isLoading || !codingProblem || accountQueryIsLoading || !account) {
        return <Loading />;
    }

    const handleSubmissionComplete = (newResults: ISubmissionResult[]) => {
        setResults(newResults);
        const allTestsPassed = newResults.length > 0 && newResults.every(r => r.statusId === 3);

        if (allTestsPassed) {
            const isDaily = codingProblem.dailyChallange && !account.solvedDailyCodingProblemToday;
            setEarnedDailyChallengeReward(!!isDaily);
            setSolvedCodingProblem(true);
            queryClient.invalidateQueries({ queryKey: ['account'] });
        }

    };

    const handleResizeStart = () => {
        setIsResizingPanels(true);
    };

    const editorPanelWidth = isResizingPanels ? 'calc(100% - 452px)' : 'auto';

    return (
        <Box className={`problem-page-container ${isResizingPanels ? 'is-resizing' : ''}`} ref={problemPageRef}>
            {solvedCodingProblem && (
                <Dialog 
                    open={solvedCodingProblem} 
                    onClose={() => setSolvedCodingProblem(false)}
                    slotProps={{
                        paper: {
                            sx: {
                                backgroundColor: 'var(--bg-3)',
                                color: 'var(--text-primary)',
                                textAlign: 'center',
                                padding: 3,
                                borderRadius: 3,
                                minWidth: '300px'
                            }
                        }
                    }}
                >
                    <DialogTitle>
                        <EmojiEventsIcon sx={{ fontSize: 64, color: '#FFD700', mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold" component="div">
                            Challenge Completed!
                        </Typography>
                    </DialogTitle>
                    
                    {earnedDailyChallengeReward ? (
                        <DialogContent>
                            <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
                                You successfully solved the Problem of the Day.
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ color: '#00E676', fontWeight: 'bold' }}>+50</Typography>
                                    <Typography variant="caption" sx={{ color: '#b0b0b0', textTransform: 'uppercase' }}>EXP</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ color: '#FFB300', fontWeight: 'bold' }}>+20</Typography>
                                    <Typography variant="caption" sx={{ color: '#b0b0b0', textTransform: 'uppercase' }}>Coins</Typography>
                                </Box>
                            </Box>
                        </DialogContent>
                    ) : (
                        <DialogContent>
                            <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
                                You successfully solved the coding problem!
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                                {account.xpAchievedToday <= 280 ? (
                                    <Box>
                                        {codingProblem.difficulty === 'EASY' && <Typography variant="h5" sx={{ color: '#00E676', fontWeight: 'bold' }}>+10</Typography>}
                                        {codingProblem.difficulty === 'MEDIUM' && <Typography variant="h5" sx={{ color: '#00E676', fontWeight: 'bold' }}>+20</Typography>}
                                        {codingProblem.difficulty === 'HARD' && <Typography variant="h5" sx={{ color: '#00E676', fontWeight: 'bold' }}>+40</Typography>}
                                        <Typography variant="caption" sx={{ color: '#b0b0b0', textTransform: 'uppercase' }}>EXP</Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#b0b0b0', textTransform: 'uppercase' }}>Daily limit of XP reached</Typography>
                                    </Box>
                                )}
                                <Box>
                                    {codingProblem.difficulty === 'EASY' && <Typography variant="h5" sx={{ color: '#FFB300', fontWeight: 'bold' }}>+5</Typography>}
                                    {codingProblem.difficulty === 'MEDIUM' && <Typography variant="h5" sx={{ color: '#FFB300', fontWeight: 'bold' }}>+10</Typography>}
                                    {codingProblem.difficulty === 'HARD' && <Typography variant="h5" sx={{ color: '#FFB300', fontWeight: 'bold' }}>+15</Typography>}
                                    <Typography variant="caption" sx={{ color: '#b0b0b0', textTransform: 'uppercase' }}>Coins</Typography>
                                </Box>
                            </Box>
                        </DialogContent>
                    )}

                    <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
                        <Button className="problem-solved-close-btn" variant="contained" onClick={() => setSolvedCodingProblem(false)}>
                            Awesome
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <ProblemDataPanel
                problem={codingProblem}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                results={results}
                panelWidth={problemPanelWidth}
            />

            <Box
                className="problem-resize-handle"
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize problem panels"
                onPointerDown={handleResizeStart}
            />

            <CodeEditorWindow
                problemId={codingProblem.id}
                codeTemplates={codingProblem.codeTemplates}
                setActiveTab={setActiveTab}
                onSubmissionComplete={handleSubmissionComplete}
                editorWidth={editorPanelWidth}
            />
        </Box>
    )
}

export default Problem;
