import { useState } from 'react';
import { Box, Button, IconButton, Popover, Typography } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';

import MarkdownRenderer from '../../../components/MarkdownRenderer/MarkdownRenderer';
import { type IProblem } from '../../../types/problem.types';
import { api } from '../../../api';
import { useMutation } from '@tanstack/react-query';
import notify from '../../../components/ui/ToastNotification';
import './ProblemDescription.style.css';

function getDifficultyColorClass(diff: string) {
    switch(diff) {
        case "EASY": return "diff-easy";
        case "MEDIUM": return "diff-medium";
        case "HARD": return "diff-hard";
        default: return "";
    }
};

function ProblemDescription({ problem }: { problem: IProblem }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const reportProblemMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post(`/reports/submit/coding-problem/${problem.id}`);
            return response.data;
        },
        onSuccess: () => {
            notify('Coding problem reported successfully', 'success');
        },
        onError: () => {
            notify('Failed to report coding problem', 'error');
        }
    });

    return (
        <Box className="problem-content">
            <Box className="problem-title-header">
                <Typography variant="h4" className="problem-title">
                    {problem.title}
                </Typography>
                <IconButton
                    className="report-flag"
                    onClick={() => reportProblemMutation.mutate()}
                    disabled={reportProblemMutation.isPending}
                    aria-label="Report coding problem"
                >
                    <FlagIcon fontSize="small" />
                </IconButton>
            </Box>

            <Box className="problem-meta-bar">
                <Box className={`difficulty-chip ${getDifficultyColorClass(problem.difficulty)}`}>
                    {problem.difficulty}
                </Box>
                <Button 
                    className='problem-tags-button'
                    variant="outlined"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    TAGS
                </Button>
                <Popover open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    sx={{
                        '& .MuiPaper-root': {
                            backgroundColor: 'transparent',
                        }
                    }}
                >
                    <Box className="tags-popover-content">
                        {problem.tags.map((tag: string, index: number) => (
                            <Box key={index}>
                                {tag}
                            </Box>
                        ))}
                    </Box>
                </Popover>
            </Box>

            <MarkdownRenderer content={problem.description} />
        </Box>
    )
}

export default ProblemDescription;