import {
    Box,
    Button,
    Popover,
    Typography
} from '@mui/material';
import { useState } from 'react';
import MarkdownRenderer from '../../../components/MarkdownRenderer/MarkdownRenderer';
import './ProblemDescription.style.css';

interface ProblemDescriptionProps {
    problem: any;
}

function ProblemDescription({ problem }: ProblemDescriptionProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const getDifficultyColorClass = (diff: string) => {
        switch(diff) {
            case "EASY": return "diff-easy";
            case "MEDIUM": return "diff-medium";
            case "HARD": return "diff-hard";
            default: return "";
        }
    };

    return (
        <Box className="problem-content">
            <Box className="problem-title-header">
                <Typography variant="h4" className="problem-title">
                    {problem.title}
                </Typography>
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