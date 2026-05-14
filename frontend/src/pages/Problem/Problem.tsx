import { useState, useEffect } from 'react';
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

const todayUTCString = new Date().toISOString().split('T')[0];

function Problem() {
    const queryClient = useQueryClient();
    const { data: account, isLoading: accountQueryIsLoading } = useAccount();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState("description");
    const [results, setResults] = useState<ISubmissionResult[]>([]);
    const [solvedDailyChallenge, setSolvedDailyChallenge] = useState(false);
    const { data: codingProblem, isLoading } = useQuery<IProblem>({
        queryKey: ['codingProblem'],
        queryFn: async () => {
            let response = await api.get(`/problems/${id}/description`);
            
            response.data.codeTemplates = JSON.parse(response.data.codeTemplates);
            response.data.description = response.data.description.replace(/\\n/g, '\n');
            
            return response.data;
        },
    });
    const isCodingProblemDoneToday = account?.lastDailyProblemDate === todayUTCString;

    useEffect(() => {
        // check for each result if the status is 3
        let allTestsPassed = results.every(result => result.statusId === 3);

        if (results.length > 0 && allTestsPassed && !isCodingProblemDoneToday) {
            setSolvedDailyChallenge(true);
            queryClient.invalidateQueries({ queryKey: ['account'] });
        }

    }, [results]);

    if (isLoading || !codingProblem || accountQueryIsLoading || !account) {
        return <Loading />;
    }

    return (
        <Box className="problem-page-container">
            {solvedDailyChallenge && (
                <Dialog 
                    open={solvedDailyChallenge} 
                    onClose={() => setSolvedDailyChallenge(false)}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'var(--bg-3)',
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            padding: 3,
                            borderRadius: 3,
                            minWidth: '300px'
                        }
                    }}
                >
                    <DialogTitle>
                        <EmojiEventsIcon sx={{ fontSize: 64, color: '#FFD700', mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold">
                            Challenge Completed!
                        </Typography>
                    </DialogTitle>
                    
                    <DialogContent>
                        <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
                            You successfully solved the Problem of the Day.
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                            <Box>
                                <Typography variant="h5" sx={{ color: '#00E676', fontWeight: 'bold' }}>+20</Typography>
                                <Typography variant="caption" sx={{ color: '#b0b0b0', textTransform: 'uppercase' }}>EXP</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{ color: '#FFB300', fontWeight: 'bold' }}>+10</Typography>
                                <Typography variant="caption" sx={{ color: '#b0b0b0', textTransform: 'uppercase' }}>Coins</Typography>
                            </Box>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
                        <Button 
                            variant="contained" 
                            onClick={() => setSolvedDailyChallenge(false)}
                            sx={{ 
                                backgroundColor: '#6b5aff', 
                                borderRadius: '20px', 
                                px: 4,
                                '&:hover': { backgroundColor: '#5a48ff' }
                            }}
                        >
                            Awesome
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <ProblemDataPanel problem={codingProblem} activeTab={activeTab} setActiveTab={setActiveTab} results={results} />
            <CodeEditorWindow problemId={codingProblem.id} codeTemplates={codingProblem.codeTemplates} setActiveTab={setActiveTab} setResults={setResults} />
        </Box>
    )
}

export default Problem;
